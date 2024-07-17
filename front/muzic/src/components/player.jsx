import React from "react";
import axios from "axios";
import "../components/static/css/player.css";

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

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      index: 0, // کنترل موزیک های قبلی و بعدی
      errors: null,
    };
    this.range = React.createRef();
    this.timePas = React.createRef();
    this.timeLimit = React.createRef();
  }

  // گرفتن اهنگ ها از سرور
  async componentDidMount() {
    try {
      const response = await axiosInstance.get("/");

      const filesData = response.data.files;
      if (filesData) {
        const files = filesData.map((m) => {
          const audio = new Audio(m.file);
          audio.addEventListener("canplay", () => {
            if (this.range.current) {
              this.range.current.max = audio.duration;
            }
            if (this.timeLimit.current) {
              this.timeLimit.current.innerText = this.formatTime(
                audio.duration
              );
            }
          });
          audio.addEventListener("timeupdate", () => {
            if (this.range.current) {
              this.range.current.value = audio.currentTime;
            }
            if (this.timePas.current) {
              this.timePas.current.innerText = this.formatTime(
                audio.currentTime
              );
            }
            if (this.timeLimit.current) {
              this.timeLimit.current.innerText = this.formatTime(
                audio.duration - audio.currentTime
              );
            }
          });
          return {
            title: m.title,
            audio: audio,
          };
        });
        this.setState({ files });
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      this.setState({ errors: "There is a problem here" });
    }
  }
  // گرفتن اهنگ ها از سرور

  // کنترل اهنگ در صورت خارج شدن از کامپوننت
  componentWillUnmount() {
    const { files, index } = this.state;
    if (files.length > 0) {
      const currentAudio = files[index].audio;
      currentAudio.pause();
    }
  }
  // کنترل اهنگ در صورت خارج شدن از کامپوننت

  // فرمنت بندی زمان موزیک
  formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  // فرمنت بندی زمان موزیک

  // کنترل وضعیت پخش اهنگ
  play = () => {
    const { files, index } = this.state;
    if (files.length === 0) {
      return;
    }

    const audio = files[index].audio;

    audio.addEventListener("ended", this.next);

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };
  // کنترل وضعیت پخش اهنگ

  // کنترل دکمه next
  next = () => {
    const { files, index } = this.state;

    if (files.length === 0) {
      return;
    }

    const currentAudio = files[index].audio;
    currentAudio.pause();
    this.range.current.value = 0;
    currentAudio.currentTime = 0;

    let newIndex = index + 1;
    if (newIndex >= files.length) {
      newIndex = 0;
    }

    this.setState({ index: newIndex }, () => {
      const newAudio = files[this.state.index].audio;
      newAudio.play();
    });
  };
  // کنترل دکمه next

  // کنترل دکمه back
  pre = () => {
    const { files, index } = this.state;

    if (files.length === 0) {
      return;
    }

    const currentAudio = files[index].audio;
    currentAudio.pause();
    this.range.current.value = 0;
    currentAudio.currentTime = 0;

    let newIndex = index - 1;
    if (newIndex < 0) {
      newIndex = files.length - 1;
    }

    this.setState({ index: newIndex }, () => {
      const newAudio = files[this.state.index].audio;
      newAudio.play();
    });
  };
  // کنترل دکمه back

  // تنظیم اینپوت range
  inputTime = (e) => {
    const { files, index } = this.state;
    const currentAudio = files[index].audio;
    currentAudio.currentTime = e.target.value;
  };
  // تنظیم اینپوت range

  render() {
    return (
      <div className="container">
        <div className="row my-5 shadow p-3 padent_div">
          <div className="col-12 d-flex justify-content-center align-items-center">
            {/* کنترل خطا */}
            {this.state.errors && <div>{this.state.errors}</div>}
            {/* کنترل خطا */}
          </div>
          <div className="col-12 d-flex justify-content-center align-items-center">
            <input
              className="custom-range my-4"
              defaultValue="0"
              type="range"
              ref={this.range}
              onInput={this.inputTime}
            />
          </div>
          <div className="col-12 d-flex justify-content-center align-items-center">
            <div className="mx-3" ref={this.timePas}></div>
            <svg
              onClick={this.pre}
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" />
            </svg>
            <svg
              onClick={this.play}
              class="mx-5 icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
            <svg
              onClick={this.next}
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" />
            </svg>
            <div className="mx-3" ref={this.timeLimit}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
