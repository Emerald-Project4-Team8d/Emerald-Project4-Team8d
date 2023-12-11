module.exports = {
    async create(ctx) {
      const { CategoryName, PossiblePoints, rubric_entries, rubric } = ctx.request.body;
  
      // Create rubric-row
      const rubricRow = await strapi.services['rubric-row'].create({
        CategoryName,
        PossiblePoints,
        rubric  // Link to the parent rubric
      });
  
      // Create entries for each rubric-row
      if (rubric_entries && rubric_entries.length) {
        for (let entry of rubric_entries) {
          await strapi.services['rubric-entry'].create({
            ...entry,
            rubricRow: rubricRow.id  // Link to the parent rubric-row
          });
        }
      }
  
      return rubricRow;
    }
  };
  