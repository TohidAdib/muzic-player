import React, { Component } from 'react';
import axios from 'axios';

/* جا گزاری توکن در قسمت هدر */
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8080/user/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
/* جا گزاری توکن در قسمت هدر */

class UploadFile extends Component {
    state = {
        file: {
            title: "",
            audioFile: null, 
        },
        message: "", // کنترل پیام های در یافتی از سرور
    };

    // تابع برای دخیره اطلاعات اینپوت تایتل در استیت
    handleTitleChange = (e) => {
        this.setState({
            file: {
                ...this.state.file,
                title: e.target.value,
            }
        });
    };
    // تابع برای دخیره اطلاعات اینپوت تایتل در استیت

    // تابع برای دخیره اطلاعات اینپوت فایل در استیت
    handleFileChange = (e) => {
        this.setState({
            file: {
                ...this.state.file,
                audioFile: e.target.files[0], 
            }
        });
    };
    // تابع برای دخیره اطلاعات اینپوت فایل در استیت

    // تابع برای ارسال اطلاعات به سرور
    handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', this.state.file.title);  
        formData.append('file', this.state.file.audioFile);
    
        try {
            const response = await axiosInstance.post('/file/', formData);
            this.setState({ message: 'File uploaded successfully' });
        } catch (error) {
            console.error(error);
            this.setState({ message: 'Failed to upload file' });
        }
    };
    // تابع برای ارسال اطلاعات به سرور
    

    render() {
        return (
            <form onSubmit={this.handleSubmit} className='container my-5'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-lg-1'>
                        <label className='form-label' htmlFor="title">Title</label>
                    </div>
                    <div className='col-lg-4'>
                        <input
                            className='form-control'
                            id='title'
                            type="text"
                            value={this.state.file.title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <div className='col-4 mx-auto my-5'>
                        <input
                            type="file"
                            onChange={this.handleFileChange}
                        />
                    </div>
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        <button className='btn btn-lg btn-info mx-auto' type="submit">Send</button>
                    </div>
                </div>

                {/* کنترل پیام های سرور */}
                {this.state.message && <p>{this.state.message}</p>}
                {/* کنترل پیام های سرور */}
                
            </form>
        );
    }
}

export default UploadFile;
