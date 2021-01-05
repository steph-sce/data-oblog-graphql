export default {
  async event(eventId) {
      return this.fetch(`
          query EventById($id: ID!) {
              event(id: $id) {
                  name,
                  description,
                  startDate,
                  endDate,
                  animations {
                      id,
                      name,
                      prestationType {
                          name
                      },
                      startDate,
                      endDate
                  },
              }
          }
      `, {
          id: eventId,
      }, "EventById");
  },
};
