import axios from 'axios';

export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const response = await axios.get('http://localhost:5000/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch current user:', err);
    return null;
  }
};
