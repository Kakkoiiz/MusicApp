var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Dung_dz'

const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const playlist = $('.playlist');
const openPlaylist = $('.open-playlist');
const closePlaylist = $('.close-playlist');
const cdThumb = $('.cd-thumb');
const cdThumbs = $$('.cd-thumb')
const progress = $('.progress');
const timeLeft = $('.time-left');
const timeRight = $('.time-right');
const songList = $('.song-list');
const heading = $('.music-description h2');
const headingSinger = $('.music-description h4')
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const play = $('.song');


// Khi tiến độ bài hát thay đổi
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}



const app = {
  currentIndex: 0,  // Chỉ mục đầu tiên của mảng (bài hát đàu tiên)
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
        name: 'Yếu đuối',
        singer: 'Dung dz',
        path: './assets/music/YeuDuoi-QuangDangTran-6690099.mp3',
        image: './assets/img/img1.jpg'
    },
    {
        name: 'Ngày mai em đi mất',
        singer: 'Dung dz 1st',
        path: './assets/music/NgayMaiEmDiMat-KhaiDangDatG-7747861.mp3',
        image: './assets/img/img2.jpg'
    },
    {
        name: 'Roi ta se ngam phao hoa cung nhau',
        singer: 'Dung dz siu',
        path: './assets/music/RoiTaSeNgamPhaoHoaCungNhau-OlewVietNam-8485329.mp3',
        image: './assets/img/img3.jpg'
    },
    {
        name: 'Anh nhớ ra',
        singer: 'Dung dz cap',
        path: './assets/music/y2mate.com - Anh Nhớ Ra  Vũ live at Soul of The Forest.mp3',
        image: './assets/img/img4.jpg'
    },
    {
        name: 'Ngày em đẹp nhất',
        singer: 'Dung dz pro',
        path: './assets/music/y2mate.com - NGÀY EM ĐẸP NHẤT  TAMA Official Music Video.mp3',
        image: './assets/img/img5.jpg'
    },
    {
        name: 'Phản bội chính mình',
        singer: 'DŨNG ĐẸP Trai',
        path: './assets/music/y2mate.com - QUÂN AP x VƯƠNG ANH TÚ  PHẢN BỘI CHÍNH MÌNH  OFFICIAL MV COVER .mp3',
        image: './assets/img/img6.jpg'
    },
    {
      name: 'Đừng ai nhắc về người ấy',
      singer: 'Dung dz',
      path: './assets/music/y2mate.com - Đạt G  Đừng Ai Nhắc Về Cô Ấy  Live at tasteofTHESOUL DatGMusic.mp3',
      image: './assets/img/img7.jpg'
  },
  ],

  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  
  // Hàm cập nhật giá trị thời gian
  updateTime: function() {
    // Lấy giá trị thời gian hiện tại và tổng cộng
    const currentTime = audio.currentTime;
    // Hiển thị giá trị thời gian hiện tại và tổng cộng trong đơn vị phút:giây
    timeLeft.textContent = formatTime(currentTime);

    // Lấy ra thời lượng song
    audio.onloadedmetadata = function() {
      const duration = audio.duration; 
      timeRight.textContent = formatTime(duration);
    };

  },

  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${(index === this.currentIndex ? 'active' : '')}" data-index = ${index}>
            <div class="btn-playlist btn-toggle-play">
                <i class="fas fa-pause icon-pause"></i>
                <i class="fas fa-play icon-play"></i>
            </div>

            <div class="music-description-playlist">
                <h2>${song.name}</h2>
                <h4>${song.singer}</h4>
            </div>

            <div class="btn-playlist btn-toggle-heart">
                <i class="fa-solid fa-heart"></i>
            </div>
        </div>
      `
    });
    songList.innerHTML = htmls.join('')
  },

  // Lấy ra bài hát đầu tiên
  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },

  handleEvent: function() {
    const _this = this;
    const cdThumbAnimates = [];

    // Xử lý khi CD quay / dừng
    cdThumbs.forEach(function(cdThumb) {
      const cdThumbAnimate = cdThumb.animate([
        {
          '-webkit-transform': 'rotate(360deg)',
          'transform': 'rotate(360deg)'
        }
      ], {
        duration: 10000,
        iterations: Infinity
      });
      cdThumbAnimate.pause();
      cdThumbAnimates.push(cdThumbAnimate);
    });


    // Xử lý bật tắt play list
    openPlaylist.onclick = function() {
      playlist.classList.remove('hide')
      playlist.classList.add('show')
      playlist.style.display = 'block';
    };

    closePlaylist.onclick = function() {
      playlist.classList.remove('show')
      playlist.classList.add('hide')
      setTimeout(() => {
        playlist.style.display = 'none';
      },500)

    };

    
    // Xử lý khi click  play
    playBtn.onclick = function() {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      const playBtnPlaylist = $('.song .btn-toggle-play');
      playBtnPlaylist.onclick = function() {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      };
    };

    // Khi song được play
    audio.onplay = function() {
      _this.updateTime()
      player.classList.add('playing')
      playlist.classList.add('playing')
      cdThumbAnimates.forEach(function(cdThumbAnimate) {
        cdThumbAnimate.play();
      });
    };

    // Khi song được pause
    audio.onpause = function() {
      player.classList.remove('playing');
      playlist.classList.remove('playing');
      cdThumbAnimates.forEach(function(cdThumbAnimate) {
        cdThumbAnimate.pause();
      });
    };
    
    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function() {
      _this.updateTime();
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
      }
    };


    // Khi tua song
    progress.oninput = function(e) {
      const seekTime = e.target.value * audio.duration / 100;
      audio.currentTime = seekTime;
    };


    // Khi next song
    nextBtn.onclick = function() {

      // Kiểm tra xem có random không
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      
      audio.play();
      _this.render();
    };

    // Khi prev song
    prevBtn.onclick = function() {
      
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.prevSong();
      }

      audio.play()
      _this.render()
    };

    // Khi ấn nút random
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom)
    }


    // Xử lý khi lặp lại song

    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }
    
    // Xử lý next song khi song end
    audio.onended = function() {
      if (_this.isRepeat){
        audio.play();
      } else {
        nextBtn.click();
      }
    }

    // Lắng nghe hành vi click vào songList

    songList.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.btn-toggle-heart')) {
        
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
       
        }
        if ( e.target.closest('.btn-toggle-heart')) {
  
        }
      }
    }


  },
  
  loadCurrentSong: function() {
    // Cập nhật tên bài hát và ca sĩ
    heading.textContent = this.currentSong.name;
    headingSinger.textContent = this.currentSong.singer;
  
    // Cập nhật nguồn audio
    audio.src = this.currentSong.path;
  
    // Cập nhật hình ảnh cho các CD thumb
    cdThumbs.forEach((cdThumb) => {
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    });
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  

  
  nextSong: function() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  
  playRandomSong: function() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },



  start: function() {
    // Gắn cấu hình config 
    this.loadConfig()

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe sự kiện
    this.handleEvent();

    // Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();
    
    // Render playlist
    this.render();

    this.updateTime();


    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)
    
  }
}

app.start();

