import axios from 'axios';

export const getStreamToken = async (jwtToken) => {
  const res = await axios.get('http://localhost:8080/api/stream/token', {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  return res.data; // { token, userId }
};
