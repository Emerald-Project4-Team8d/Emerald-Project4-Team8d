module.exports = {
    async create(ctx) {
      const { Description, Points, rubricRow } = ctx.request.body;
  
      // Create rubric-entry
      const rubricEntry = await strapi.services['rubric-entry'].create({
        Description,
        Points,
        rubricRow  // Link to the parent rubric-row
      });
  
      return rubricEntry;
    }
  };
  