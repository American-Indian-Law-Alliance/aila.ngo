export const drafts = eleventyConfig => {
  const isUnpublished = data => data.published === false;
  const isDraft = data => data.draft && !process.env.BUILD_DRAFTS;

  eleventyConfig.addGlobalData('eleventyComputed.permalink', function () {
    return data => {
      // Only `published: false` is hidden; missing `published` or `published: true` publishes normally.
      // Drafts are hidden unless explicitly built.
      if (isUnpublished(data) || isDraft(data)) {
        return false; // Ensure templates that use this handle it correctly
      }
      return data.permalink;
    };
  });

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData('eleventyComputed.eleventyExcludeFromCollections', function () {
    return data => {
      // Only `published: false` is excluded; missing `published` or `published: true` publishes normally.
      // Drafts are excluded unless explicitly built.
      if (isUnpublished(data) || isDraft(data)) {
        return true;
      }

      return data.eleventyExcludeFromCollections ?? false;
    };
  });

  eleventyConfig.on('eleventy.before', ({runMode}) => {
    // Set the environment variable
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true;
    }
  });
};
