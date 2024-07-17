import axios from "axios";
import React, { Component } from "react";
import { format, parseISO } from "date-fns";
import { Modal, Button } from "react-bootstrap";

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

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oneFile: null,
      list: {},
      errors: "",
      show: false, //کنترل نمایش مودال حذف اهنگ 
      showCreate: false, // کنترل نمایش مودال ایجاد البوم
      selectedFileId: null, //جایگذاری ایدی برای حذف اهنگ مورد نظر
    };
    this.currentAudio = null; // جای گذاری موزیک فعلی
  }

  async componentDidMount() {
    //گرفتن اهنگ ها از سرور
    try {
      const response = await axiosInstance.get("/");
      this.setState({ list: response.data });
    } catch (error) {
      this.setState({ errors: "somthings wrong please try again later" });
    }
    //گرفتن اهنگ ها از سرور
    // Load stored records from localStorage
  }

  // کنترل اهنگ در صورت خارج شدن از کامپوننت
  componentWillUnmount() {
    // توقف آهنگ قبلی
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    // توقف آهنگ قبلی
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

  // انتخاب موزیک
  choiceAudio = async (e) => {
    const input = e.currentTarget;
    const copyInput = input.cloneNode();
    copyInput.innerText = "play";
    const parent = input.closest(".tr_body");
    const parentTd = input.parentElement;
    const id = parent.getAttribute("pk");

    try {
      const response = await axiosInstance.get(`/file/${id}/`);
      this.setState({ oneFile: response.data }, () => {
        this.playAudio(input, copyInput, parentTd);
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ errors: "file not found" });
      } else {
        this.setState({ errors: "failed" });
      }
    }
  };

  playAudio = (input, copyInput, parentTd) => {
    // توقف آهنگ قبلی
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    // توقف آهنگ قبلی

    // ذخیره آهنگ جدید در currentAudio
    const audio = new Audio(this.state.oneFile.file);
    this.currentAudio = audio;
    // ذخیره آهنگ جدید در currentAudio

    input.remove();

    // کنترل وضعیت موزیک
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    // کنترل وضعیت موزیک

    // ایجاد المنت برای کنترل وضعیت پخش موزیک کلیک شده
    const nDiv = document.createElement("div");
    nDiv.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );

    const nSpan = document.createElement("span");

    const nBtn = document.createElement("button");
    nBtn.innerText = "cancel";
    nBtn.classList.add("btn", "btn-secondary", "mx-2");
    nBtn.addEventListener("click", () => {
      nDiv.remove();
      parentTd.appendChild(copyInput);
      copyInput.addEventListener("click", this.choiceAudio);
      audio.pause();
      nBtn.remove();
      nInput.remove();
      nSpan.remove();
    });

    const nInput = document.createElement("input");
    nInput.type = "range";
    nInput.addEventListener("input", (e) => {
      audio.currentTime = e.target.value;
    });

    audio.addEventListener("canplay", () => {
      nInput.max = audio.duration;
    });

    audio.addEventListener("timeupdate", () => {
      nInput.value = audio.currentTime;
      nSpan.innerText = this.formatTime(audio.currentTime);
    });
    // ایجاد المنت برای کنترل وضعیت پخش موزیک کلیک شده

    // اضاف کردن المنت های ایجاد شده به جدول
    nDiv.appendChild(nInput);
    nDiv.appendChild(nSpan);
    nDiv.appendChild(nBtn);
    parentTd.appendChild(nDiv);
    // اضاف کردن المنت های ایجاد شده به جدول
  };
  // انتخاب موزیک

  // کنترل وضعیت جستوجو کردن کاربر برای پیدا کردن اهنگ
  // فیلتر شده با Title
  handleSearch = (e) => {
    const input = e.currentTarget;
    const titles = document.querySelectorAll(".title");
    titles.forEach((f) => {
      const tr = f.closest(".tr_body");
      if (f.innerText.includes(input.value)) {
        tr.classList.remove("d-none");
      } else {
        tr.classList.add("d-none");
      }
    });
  };
  // کنترل وضعیت جستوجو کردن کاربر برای پیدا کردن اهنگ

  // کنترل وضعیت حدف اهنگ با مودال
  /* ||MODAL */

  // تابع برای بستن مودال و ست کردن ایدی به نول
  handleClose = () => {
    this.setState({ show: false, selectedFileId: null });
  };
  // تابع برای بستن مودال و ست کردن ایدی به نول

  //   تابع برای نمایش کودال و ست کردن ایدی
  handleShow = (id) => {
    this.setState({ show: true, selectedFileId: id });
  };
  //   تابع برای نمایش کودال و ست کردن ایدی

  //  تابع کنترل حذف اهنگ
  handelDelete = async () => {
    const id = this.state.selectedFileId;

    // گرقتن اهنگ مد نظر و وضغیت پخش ان
    try {
      const response = await axiosInstance.delete(`/file/${id}/`);
      this.setState((prevState) => ({
        list: {
          files: prevState.list.files.filter((file) => file.id !== id),
        },
        show: false,
        selectedFileId: null,
      }));
      this.currentAudio.pause();
    } catch (error) {
      this.setState({ errors: "file not found" });
    }
    // گرقتن اهنگ مد نظر و وضغیت پخش ان
  };
  //  تابع کنترل حذف اهنگ

  /* ||END MODAL */
  // کنترل وضعیت حدف اهنگ با مودال

  // فرمت بندی تاریخ ایجاد شده موزیک
  formatDate = (date) => {
    const formattedDate = format(parseISO(date), "yyyy-MM-dd HH:mm:ss");
    return formattedDate;
  };
  // فرمت بندی تاریخ ایجاد شده موزیک


  render() {
    const { list, errors } = this.state;

    // بررسی برای اینکه ایا اهنگی وجود دارد یا خیر
    if (!list.files || list.files.length === 0) {
      return (
        <div className="container">
          {errors ? <div>Error: {errors}</div> : <div>Loading...</div>}
        </div>
      );
    }
    // بررسی برای اینکه ایا اهنگی وجود دارد یا خیر

    // رندر کردن این بخش در صورت داشتن موزیک
    return (
      <div className="container">
        {/* اینپوت سرچ و لیبل */}
        <div className="col-6 mx-auto mt-2">
          <label className="form-label" htmlFor="search">
            search
          </label>
          <input
            onChange={this.handleSearch}
            id="search"
            type="search"
            className="form-control"
          />
        </div>
        {/* اینپوت سرچ و لیبل */}

        {/* ایجاد جدول و قرار دادن لیست اهنگ و پخش */}
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Created At</th>
              <th>Audio</th>
              <th>Play</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {list.files.map((m, index) => (
              <tr className="tr_body" key={index} pk={m.id}>
                <td className="check">
                  <input type="checkbox" />
                </td>
                <td className="title">{m.title}</td>
                <td>{this.formatDate(m.created_at)}</td>
                <td>{m.file}</td>
                <td>
                  <button
                    onClick={this.choiceAudio}
                    className="btn btn-primary"
                  >
                    play
                  </button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => this.handleShow(m.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ایجاد جدول و قرار دادن لیست اهنگ و پخش */}

        {/* تنظیم رفتار مودال */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this song?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              No
            </Button>
            <Button variant="danger" onClick={this.handelDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* تنظیم رفتار مودال */}


      </div>
    );
    // رندر کردن این بخش در صورت داشتن موزیک
  }
}

export default Album;
