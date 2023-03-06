import axios from 'axios';


const postData = async (data: string) => {
  try {
    const response = await axios.post('https://www.uknowwhoim.me/hosted/legal-project/query', data);
    console.log(response.data);
    // Handle the response data here
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
}

export default postData;
