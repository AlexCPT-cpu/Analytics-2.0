import axios from "axios";

const fetch = async (method, endpoint, payload) => {
  if (method === "GET") {
    const response = await axios.get(endpoint, payload);
    return response;
  } else if (method === "POST") {
    const response = await axios.post(endpoint, payload);
    return response;
  } else {
    const response = await axios.delete(endpoint, {
      data: {
        payload,
      },
    });
    return response;
  }
};

export default fetch;
