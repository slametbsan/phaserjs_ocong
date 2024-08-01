// GLOBAL VARIABEL
var snd_ambience = null;
var layoutSize = { 'w': 1024, 'h': 768 }; //1024 x 768
var X_POSITION;
var Y_POSITION;

var nyawa;
var heartOutlines = [], hearts = [], maxHearts = 3;

class scnMenu extends Phaser.Scene {
   constructor() {
      super({
         key: "scnMenu",
         pack: {
            files: [
               { type: 'image', key: 'logo', url: 'assets/gamedev_smkn1ngk.png' }
            ]
         }
      });
   }

   preload() {
      // load particles
      this.load.setPath('assets/particles/');
      this.load.atlas('ptc_flares', 'flares.png', 'flares.json');

      // load animasi spine
      this.load.setPath('assets/spine/');
      this.load.spine('coin-pro', 'spine.json', 'coin-pro.atlas'); //file image, json, atlas

      this.load.path = 'assets/';

      this.load.image('logo', 'gamedev_smkn1ngk.png');
      this.load.image('bg_start', 'bg_start.png');
      this.load.image('btn_play', 'btn_play.png');
      this.load.image('title_game', 'title_game.png');
      this.load.image('panel_skor', 'panel_skor.png');
      this.load.image('chara', 'chara.png');
      this.load.image('fg_loop_back', 'fg_loop_back.png');
      this.load.image('fg_loop', 'fg_loop.png');
      this.load.image('obstc', 'obstc.png');
      this.load.image('nyawa_outline', 'nyawa_outline.png');
      this.load.image('nyawa_full', 'nyawa_full.png');
      this.load.image('powerup', 'powerup.png');
      this.load.image('shield', 'shield.png');
      this.load.image('shieldOn', 'shield_up.png');

      this.load.image('ptc_blue', 'particles/particle_blue.png');
      this.load.spritesheet('sps_mummy', 'mummy37x45.png', { frameWidth: 37, frameHeight: 45 });

      // load audio dan musik
      this.load.audio('snd_ambience', ['audio/ambience.ogg', 'audio/ambience.mp3']);
      this.load.audio('snd_touch', ['audio/touch.ogg', 'audio/touch.mp3']);
      this.load.audio('snd_transisi_menu', ['audio/transisi_menu.ogg', 'audio/transisi_menu.mp3']);
      this.load.audio('snd_dead', ['audio/dead.ogg', 'audio/dead.mp3']);
      this.load.audio('snd_klik_1', ['audio/klik_1.ogg', 'audio/klik_1.mp3']);
      this.load.audio('snd_klik_2', ['audio/klik_2.ogg', 'audio/klik_2.mp3']);
      this.load.audio('snd_klik_3', ['audio/klik_3.ogg', 'audio/klik_3.mp3']);

   }

   create() {
      X_POSITION = {
         'LEFT': 0,
         'CENTER': game.canvas.width / 2,
         'RIGHT': game.canvas.width
      };

      Y_POSITION = {
         'TOP': 0,
         'CENTER': game.canvas.height / 2,
         'BOTTOM': game.canvas.height
      };
      // menambahkan background
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'bg_start');
      // menambahkan tombol Play
      var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 65, 'btn_play');
      btnPlay.setDepth(10);
      // menambahkan judul game
      var titleGame = this.add.image(X_POSITION.CENTER, 200, 'title_game');
      titleGame.setDepth(10);
      titleGame.y -= 384;
      var diz = this;

      // menambahkan animasi tombol Play
      btnPlay.setScale(0);
      this.tweens.add({
         targets: btnPlay,
         ease: 'Back',
         duration: 500,
         delay: 750,
         scaleX: 1,
         scaleY: 1
      });

      // MENANGANI INPUT PEMAIN
      btnPlay.setInteractive();

      var btnClicked = false;

      this.input.on('gameobjectover', function (pointer, gameObject) {
         console.log('Scene Menu | Object Over');

         if (!btnClicked) return;

         if (gameObject == btnPlay) { btnPlay.setTint(0x616161); }
      }, this);

      this.input.on('gameobjectout', function (pointer, gameObject) {
         console.log('Scene Menu | Object Out');

         if (!btnClicked) return;

         if (gameObject == btnPlay) { btnPlay.setTint(0xffffff); }
      }, this);

      this.input.on('gameobjectdown', function (pointer, gameObject) {
         console.log('Scene Menu | Object Click');

         if (gameObject == btnPlay) {
            btnPlay.setTint(0x616161);
            btnClicked = true;
         }
      }, this);

      this.input.on('gameobjectup', function (pointer, gameObject) {
         console.log('Scene Menu | Object End Click');

         if (gameObject == btnPlay) {
            btnPlay.setTint(0xffffff);

            this.snd_touch.play();

            // jalankan scnPlay
            this.scene.start('scnPlay');
         }
      }, this);

      this.input.on('pointerup', function (pointer, currentlyOver) {
         console.log('Scene Menu | Mouse Up');

         btnClicked = false;
      }, this);

      // MENYIMPAN KE DALAM DATABASE
      // membuat panel skor
      var skorTertinggi = localStorage['highscore'] || 0;

      // menambahkan panel skor
      var panelSkor = this.add.image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 120, 'panel_skor');
      panelSkor.setOrigin(0.5);
      panelSkor.setDepth(10);
      panelSkor.setAlpha(0.8);

      // membuat label skor pada panel
      this.lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, 'Highscore: ' + skorTertinggi);
      this.lblSkor.setOrigin(0.5);
      this.lblSkor.setDepth(10);
      this.lblSkor.setFontSize(30);
      this.lblSkor.setTint(0xff732e);

      // MENAMBAHKAN AUDIO
      if (snd_ambience == null) {
         snd_ambience = this.sound.add('snd_ambience');
         snd_ambience.loop = true;
         snd_ambience.setVolume(0.35);
         snd_ambience.play();
      }

      // variabel sound lain
      this.snd_touch = this.sound.add('snd_touch');
      var snd_transisi = this.sound.add('snd_transisi_menu');

      // animasi spine, plugin ditambahkan di config
      var spnCoin = this.add.spine(X_POSITION.CENTER, 100, 'coin-pro', 'animation', true); //ganti 'coin-pro' dg nama aset yg kamu punya
      spnCoin.setScale(0.5);

      // animasi spritesheet mummy
      const mummyAnimation = this.anims.create({
         key: 'walk',
         frames: this.anims.generateFrameNumbers('sps_mummy'),
         frameRate: 16
      });

      const sprite = this.add.sprite(X_POSITION.CENTER - 270, Y_POSITION.CENTER + 150, 'sps_mummy').setScale(4);
      sprite.play({ key: 'walk', repeat: -1 });

      // particles
      var particleLeft = this.add.particles('ptc_flares');
      particleLeft.setVisible(false);
      particleLeft.createEmitter({
         frame: 'blue',
         x: X_POSITION.CENTER - 100,
         y: 220,
         lifespan: 1400,
         speed: { min: 100, max: 300 },
         angle: 220,
         gravityY: 500,
         scale: { start: 0.6, end: 0 },
         quantity: 1,
         blendMode: 'ADD'
      });

      var particleRight = this.add.particles('ptc_flares');
      particleRight.setVisible(false);
      particleRight.createEmitter({
         frame: 'yellow',
         x: X_POSITION.CENTER + 100,
         y: 220,
         lifespan: 1400,
         speed: { min: 100, max: 300 },
         angle: 320,
         gravityY: 500,
         scale: { start: 0.6, end: 0 },
         quantity: 1,
         blendMode: 'ADD'
      });

      // menambahkan animasi judul
      this.tweens.add({
         targets: titleGame,
         ease: 'Bounce.easeOut',
         duration: 750,
         delay: 250,
         y: 200,
         onComplete: function () {
            particleLeft.setVisible(true);
            particleRight.setVisible(true);
            snd_transisi.play();
         }
      });
   }
};

class scnPlay extends Phaser.Scene {
   constructor() {
      super({ key: "scnPlay" });
   }

   preload() { }

   create() {
      // nyawa dan power up
      // nyawa = maxHearts;
      nyawa = 3;

      //create three heart outlines...
      var heartOutline1 = this.add.image(X_POSITION.RIGHT - 100, 60, 'nyawa_outline').setDepth(4);
      var heartOutline2 = this.add.image(X_POSITION.RIGHT - 60, 60, 'nyawa_outline').setDepth(4);
      var heartOutline3 = this.add.image(X_POSITION.RIGHT - 20, 60, 'nyawa_outline').setDepth(4);
      //and store in an array for easy access later
      heartOutlines = [heartOutline1, heartOutline2, heartOutline3];

      //create three heart fills...
      var heart1 = this.add.image(X_POSITION.RIGHT - 100, 60, 'nyawa_full').setDepth(5);
      var heart2 = this.add.image(X_POSITION.RIGHT - 60, 60, 'nyawa_full').setDepth(5);
      var heart3 = this.add.image(X_POSITION.RIGHT - 20, 60, 'nyawa_full').setDepth(5);
      //and store in an array for easy access later
      hearts = [heart1, heart2, heart3];

      // menambahkan karakter player
      this.chara = this.add.image(130, Y_POSITION.CENTER, 'chara');
      this.chara.setDepth(3);
      // atur skala karakter menjadi 0 (tidak tampak)
      this.chara.setScale(0);

      // sprite baru untuk shield dan menyembunyikannya dengan setVisible(false)
      this.shield = this.add.image(this.chara.x - this.chara.width / 2, this.chara.y, 'shieldOn');
      this.shield.setDepth(4);
      this.shield.setScale(0.5);
      this.shield.setVisible(false);

      this.isGameRunning = false;

      var myScene = this;

      // animasi karakter player
      this.tweens.add({
         delay: 250,
         targets: this.chara,
         ease: 'Back.Out',
         duration: 500,
         scaleX: 1,
         scaleY: 1,
         onComplete: function () {
            myScene.isGameRunning = true;
            myScene.trail.setVisible(true);
         }
      });

      this.input.on('pointerup', function (pointer, currentlyOver) {
         console.log('Scene Play | Mouse Up');

         if (!this.isGameRunning) return;

         // acak sound
         this.snd_click[Math.floor((Math.random() * 2))].play();

         this.charaTweens = this.tweens.add({
            targets: this.chara,
            ease: 'Power1',
            duration: 750,
            y: this.chara.y + 200
         });
      }, this);

      // PARALLAX BACKGROUND
      this.backgrounds = [];

      // variabel pengganti angka
      var bg_x = X_POSITION.LEFT + 1366 / 2;

      // perulangan 3 kali
      for (let i = 0; i < 3; i++) {
         // array background baru
         var bg_awal = [];

         // membuat background dan foreground
         var BG = this.add.image(bg_x, Y_POSITION.CENTER, 'fg_loop_back');
         var FG = this.add.image(bg_x, Y_POSITION.CENTER, 'fg_loop');

         // menambahkan custom data
         BG.setData('kecepatan', 2);
         FG.setData('kecepatan', 4);
         FG.setDepth(2);

         // masukkan ke array bg_awal
         bg_awal.push(BG);
         bg_awal.push(FG);

         // masukkan array bg_awal ke array this.backgrounds
         this.backgrounds.push(bg_awal);

         // menambah nilai bg_x untuk perulangan selanjutnya
         bg_x += X_POSITION.LEFT + 1366;
      }

      // MENAMBAHKAN HALANGAN
      this.timerHalangan = 0;
      this.halangan = [];

      // tambahan untuk power-up nyawa
      this.timePowerUp = 0;
      this.powerUps = [];

      // MENAMBAHKAN PANEL SKOR
      this.score = 0;
      this.panel_score = this.add.image(X_POSITION.CENTER, 60, 'panel_skor');
      this.panel_score.setOrigin(0.5);
      this.panel_score.setDepth(10);
      this.panel_score.setAlpha(0.8);
      // membuat label nilai dengan nilai dari variabel this.score
      this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score);
      this.label_score.setOrigin(0.5);
      this.label_score.setDepth(10);
      this.label_score.setFontSize(30);
      this.label_score.setTint(0xff732e);

      // FUNGSI GAME OVER
      this.gameOver = function () {
         let highScore = localStorage['highscore'] || 0;

         if (myScene.score > highScore) { localStorage['highscore'] = myScene.score; }

         // this.scene.restart
         myScene.scene.start('scnMenu');
      }

      // MENAMBAHKAN EFEK AUDIO
      this.snd_dead = this.sound.add('snd_dead');

      this.snd_click = [];
      this.snd_click.push(this.sound.add('snd_klik_1'));
      this.snd_click.push(this.sound.add('snd_klik_2'));
      this.snd_click.push(this.sound.add('snd_klik_3'));

      // atur volume klik 50%
      for (let i = 0; i < this.snd_click.length; i++) {
         this.snd_click[i].setVolume(0.5);
      }

      // MEMBUAT PARTIKEL
      this.trail = this.add.particles('ptc_blue');

      // membuat emitter
      this.trailEmitter = this.trail.createEmitter({
         x: 0,
         y: 0,
         angle: { min: 0, max: 360 },
         scale: { start: 1, end: 0 },
         blendMode: 'SCREEN',
         lifeSpan: 400,
         speed: 100,
         on: true,
         follow: this.chara,
         tint: 0xff1d00
      });

      this.trailEmitter.emitParticle(16); //jml partikel yang dimunculkan
      this.trail.setDepth(2);
      this.trail.setVisible(false);

      // tambahan untuk power-up shield ---------------
      this.timerShield = 0;   //timer kemunculan shield
      this.shields = [];  //array shields

      this.activateShield = () => {
         console.log('shield diaktifkan!');

         // Hapus timer yang ada jika masih aktif
         if (myScene.shieldTimer) myScene.shieldTimer.remove(false);

         // Buat timer baru dengan delay yang lebih lama
         myScene.shieldTimer = this.time.addEvent({
            delay: 5000, // 5000 milidetik = 5 detik
            callback: () => {
               console.log('boom!');
               myScene.deactivateShield();
            }
         });

         this.isShielded = true;
         // this.chara.setTint(0xF9E400);

         // Tampilkan shield dan atur posisinya di sebelah kanan this.chara
         this.shield.setVisible(true);

         // Mulai efek berkedip setelah 4 detik (1 detik sebelum shield habis)
         this.time.delayedCall(4000, () => {
            this.startShieldBlink();
         });
      }

      this.deactivateShield = () => {
         this.isShielded = false;
         this.chara.clearTint();
         // Sembunyikan shield
         this.shield.setVisible(false);

         // Hentikan efek berkedip
         this.stopShieldBlink();
      }

      // Method untuk memulai efek berkedip
      this.startShieldBlink = () => {
         this.shieldBlinkTween = this.tweens.add({
            targets: this.shield,
            alpha: 0,
            duration: 250,
            yoyo: true,
            repeat: -1
         });
      }

      // Method untuk menghentikan efek berkedip
      this.stopShieldBlink = () => {
         if (this.shieldBlinkTween) {
            this.shieldBlinkTween.stop();
            this.shield.setAlpha(1); // Kembalikan alpha ke nilai semula
         }
      }

   }

   update() {
      if (this.isGameRunning) {
         // KARAKTER PLAYER
         this.chara.y -= 5;
         // batas agar karakter player tidak jatuh ke bawah
         if (this.chara.y > 690) this.chara.y = 690;

         // MEMBUAT BACKGROUND MENJADI PARALLAX
         for (let i = 0; i < this.backgrounds.length; i++) {
            for (var j = 0; j < this.backgrounds[i].length; j++) {
               this.backgrounds[i][j].x -= this.backgrounds[i][j].getData('kecepatan');

               if (this.backgrounds[i][j].x <= -(1366 / 2)) {
                  // gambar yang keluar layar (kiri) dipindah ke posisi paling belakang dari sisa gambar yang ada (paling kanan)
                  // diff = lebar_gambar x (panjang_array_background - 1)
                  var diff = 1366 * this.backgrounds.length - 1;

                  // posisi this.background[i][j].x saat ini ditambah dengan diff sebagai posisi baru
                  this.backgrounds[i][j].x += diff;
               }
            }
         }

         // MENAMBAH HALANGAN SECARA OTOMATIS
         if (this.timerHalangan == 0) {
            var acak_y = Math.floor((Math.random() * 680) + 60);

            var halanganBaru = this.add.image(1500, acak_y, 'obstc');

            // mengubah anchor point berada di kiri, bukan di tengah
            halanganBaru.setOrigin(0.0);
            halanganBaru.setData('status_aktif', true);
            halanganBaru.setData('kecepatan', Math.floor((Math.random() * 15) + 10));
            halanganBaru.setDepth(5);

            // masukkan halangan ke dalam array
            this.halangan.push(halanganBaru);

            // mengatur waktu untuk memunculkan halangan selanjutnya
            this.timerHalangan = Math.floor((Math.random() * 50) + 50);
         }

         var myScene = this;

         for (let i = this.halangan.length - 1; i >= 0; i--) {
            // memunculkan halangan
            this.halangan[i].x -= this.halangan[i].getData('kecepatan');

            // hapus halangan jika keluar layar
            if (this.halangan[i].x < -200) {
               this.halangan[i].destroy();
               this.halangan.splice(i, 1);
               break;
            }

            // menambah score jika posisi halangan + 50 lebih kecil dari posisi karakter dan status halangan masih aktif
            if (this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData('status_aktif') == true) {
               // ubah status halangan menjadi tidak aktif
               this.halangan[i].setData('status_aktif', false);
               // tambahkan skor
               this.score++;
               // ubah lanel menjadi nilai terbaru
               this.label_score.setText(this.score);
            }

            // deteksi tubrukan chara dan halangan
            if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y) && this.halangan[i].getData('status_aktif') == true) {
               this.halangan[i].setData('status_aktif', false);

               //jika shield aktif, return --tambahkan efek partikel saja supaya halangan hancur
               if (this.isShielded) {
                  this.score++;
                  this.label_score.setText(this.score);

                  return;
               }

               //menampilkan visual nyawa
               var currentHeartCount = nyawa;
               var currentHeart = hearts[currentHeartCount - 1];

               nyawa -= 1;

               //fade out
               myScene.tweens.add({
                  targets: currentHeart,
                  alpha: 0,
                  scaleX: 0,
                  scaleY: 0,
                  ease: 'Linear',
                  duration: 200
               });

               if (nyawa <= 0) {
                  this.isGameRunning = false;   // ubah status game
                  this.snd_dead.play();   // mainkan sound fx
                  this.trail.setVisible(false); // sembunyikan trail

                  if (this.charaTweens != null) { this.charaTweens.stop(); }  // cek variabel chara

                  // tampilkan animasi kalah
                  this.charaTweens = this.tweens.add({
                     targets: this.chara,
                     ease: 'Elastic.easeOut',
                     duration: 2000,
                     alpha: 0,
                     onComplete: myScene.gameOver  // memanggil fungsi gameOver
                  });
               } else {
                  // berkedip
                  this.tweens.add({
                     targets: this.chara,
                     ease: 'Elastic.easeOut',
                     duration: 100,
                     alpha: { from: 1, to: 0.2 },
                     repeat: 3,
                     yoyo: true,
                     onComplete: () => {
                        this.chara.setAlpha(1);
                     }
                  });
               }

               break;
            }

            //jika shield aktif dan terjadi tabrakan dengan halangan
            if (this.isShielded && this.shield.getBounds().contains(this.halangan[i].x, this.halangan[i].y)) {
               this.halangan[i].setData('status_aktif', false);
               this.halangan[i].destroy();
               this.halangan.splice(i, 1);

               this.score++;
               this.label_score.setText(this.score);
            }
         }

         // mengurangi timer
         this.timerHalangan--;

         // deteksi jika karakter terbang melebih batas layar atas
         if (this.chara.y < -50) {
            this.isGameRunning = false;

            this.snd_dead.play();
            this.trail.setVisible(false);

            if (this.charaTweens != null) { this.charaTweens.stop(); }

            this.charaTweens = this.tweens.add({
               targets: this.chara,
               ease: 'Elastic.easeOut',
               duration: 2000,
               alpha: 0,
               onComplete: myScene.gameOver
            });
         }

         // tambahan untuk power-up
         if (this.timePowerUp == 0) {
            //acak posisi munculnya power-up
            let random_y = Math.floor((Math.random() * 680) + 60);

            //membuat obyek power-up
            let powerUpBaru = this.add.image(1500, random_y, 'powerup');
            powerUpBaru.setOrigin(0.0);
            powerUpBaru.setData('status_aktif', true);
            powerUpBaru.setData('kecepatan', Math.floor((Math.random() * 15) + 10));
            powerUpBaru.setDepth(5);
            powerUpBaru.setScale(1.5);

            this.powerUps.push(powerUpBaru);
            this.timePowerUp = Math.floor((Math.random() * 50) + 50);
         }

         for (let a = this.powerUps.length - 1; a >= 0; a--) {
            this.powerUps[a].x -= this.powerUps[a].getData('kecepatan');

            // menghilangkan power-up yang sudah keluar layar
            if (this.powerUps[a].x < -200) {
               this.powerUps[a].destroy();
               this.powerUps.splice(a, 1);
               break;
            }

            //deteksi tubrukan chara dengan power-up
            if (this.chara.getBounds().contains(this.powerUps[a].x, this.powerUps[a].y) && this.powerUps[a].getData('status_aktif') == true) {

               if (nyawa < 3) {
                  //ubah status power-up menjadi tidak aktif
                  this.powerUps[a].setData("status_aktif", false);

                  // Menggunakan power-up sebagai partikel
                  let powerUpTexture = this.powerUps[a].texture.key; // Mendapatkan key dari tekstur power-up
                  let particles = this.add.particles(powerUpTexture).setDepth(4);

                  let emitter = particles.createEmitter({
                     x: this.powerUps[a].x,
                     y: this.powerUps[a].y,
                     speed: { min: 100, max: 200 },
                     angle: { min: 0, max: 360 },
                     scale: { start: 1, end: 0 },
                     lifespan: 500,
                     blendMode: 'ADD'
                  });

                  // Hapus emitter setelah partikel selesai
                  this.time.delayedCall(500, () => {
                     particles.destroy();
                  });

                  this.powerUps[a].destroy();
                  this.powerUps.splice(a, 1);

                  nyawa += 1;  //nyawa bertambah jika nyawa kurang dari 3 (maksimum)

                  //menampilkan visual nyawa
                  let currHeartCount = nyawa;
                  let currHeart = hearts[currHeartCount - 1];
                  // let currHeartOutline = heartOutlines[currHeartCount - 1];

                  //sembunyikan
                  myScene.tweens.add({
                     targets: currHeart,
                     alpha: 1,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Linear',
                     duration: 200
                  });
               }

               break;
            }
         }

         this.timePowerUp--;

         // TAMBAHAN UNTUK POWER-UP SHIELD-----------------------
         if (this.timerShield == 0) {
            //acak posisi munculnya power-up
            let random_y = Math.floor((Math.random() * 680) + 60);

            //membuat obyek power-up
            let shieldBaru = this.add.image(1500, random_y, 'shield');
            shieldBaru.setOrigin(0.0);
            shieldBaru.setData('status_aktif', true);
            shieldBaru.setData('kecepatan', Math.floor((Math.random() * 15) + 10));
            shieldBaru.setDepth(5);
            shieldBaru.setScale(0.75);

            this.shields.push(shieldBaru);
            this.timerShield = Math.floor((Math.random() * 50) + 800);
         }

         for (let b = this.shields.length - 1; b >= 0; b--) {
            // membuat shield bergerak
            this.shields[b].x -= this.shields[b].getData('kecepatan');

            // menghilangkan power-up yang sudah keluar layar
            if (this.shields[b].x < -200) {
               this.shields[b].destroy();
               this.shields.splice(b, 1);
               break;
            }

            //deteksi tubrukan chara dengan power-up shield
            if (this.chara.getBounds().contains(this.shields[b].x, this.shields[b].y)) {

               if (this.shields[b].getData('status_aktif') == true) {
                  this.shields[b].setData("status_aktif", false);    //ubah status power-up menjadi tidak aktif

                  if (this.isShielded) return;

                  //aktifkan tameng untuk durasi tertentu
                  this.activateShield();

                  this.shields[b].destroy(); //hapus power-up
                  this.shields.splice(b, 1);
               }

               break;
            }
         }

         this.timerShield--;

         if (this.isShielded) {
            this.shield.setPosition(this.chara.x + this.chara.width / 2 + 10, this.chara.y);
         }

      }
   }
};

// konfigurasi phaser
const config = {
   type: Phaser.AUTO,
   width: 1024,
   height: 768,
   plugins: {
      scene: [
         { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" } //tambahkan SpinePlugin, tambahkan dulu SpinePlugin.min.js
      ]
   },
   scene: [scnMenu, scnPlay],
};

const game = new Phaser.Game(config);