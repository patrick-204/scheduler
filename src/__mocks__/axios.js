const fixtures = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1,
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1,
    },
  ],
  appointments: {
    1: { id: 1, time: "12pm", interview: null },
    2: {
      id: 2,
      time: "1pm",
      interview: { student: "Archie Cohen", interviewer: 2 },
    },
    3: {
      id: 3,
      time: "2pm",
      interview: { student: "Leopold Silvers", interviewer: 4 },
    },
    4: { id: 4, time: "3pm", interview: null },
  },
  interviewers: {
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
    3: {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png",
    },
    4: {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg",
    },
  },
};

export default {
  get: jest.fn((url) => {
    if (url === "/api/days") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.days,
      });
    }

    if (url === "/api/appointments") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.appointments,
      });
    }

    if (url === "/api/interviewers") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.interviewers,
      });
    }
  }),

  put: jest.fn((url, data) => {
    if (url === "/api/days") {
      const day = fixtures.days.find(day => day.id === data.id);
      if (day) {
        day.spots = data.spots; 
      }
  
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
  
    if (url === "/api/appointments") {
      const appointment = fixtures.appointments[data.id];
      if (appointment) {
        appointment.interview = data.interview; 
        return Promise.resolve({
          status: 204,
          statusText: "No Content",
          data: appointment, // Return the updated appointment
        });
      }
    }
  
    if (url === "/api/interviewers") {
      const interviewer = fixtures.interviewers[data.id];
      if (interviewer) {
        interviewer.name = data.name; 
        interviewer.avatar = data.avatar; 
      }
  
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
  
    return Promise.reject({
      status: 404,
      statusText: "Not Found",
    });
  }),

  delete: jest.fn((url) => {
    if (url === "/api/appointments") {
      return Promise.resolve({
        status: 204,
        statusText: "No Content",
      });
    }
    
    return Promise.reject({
      status: 404,
      statusText: "Not Found",
    });
  }),
};
