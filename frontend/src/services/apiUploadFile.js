import  axios from "axios";

export const apiUploadFile = (imagedata) => {
	let BASE_URL = "https://localhost:3001";

	const url = `${BASE_URL}/file/uploadFile`;
	const formData = new FormData();
	formData.append("file", imagedata);
	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};
	return axios.post(url, formData, config);

}
	