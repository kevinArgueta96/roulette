const app = Vue.createApp({
  data:()=> {
    return {
      result: [],
      counter: 0,
      name: '',
      options:  ['Premio 1', 'Premio 2', 'Premio 3', 'Premio 4', 'Premio 5', 'Premio 6'],
      startAngle: 0,
      spinTimeout: null,
      spinArcStart: 10,
      spinTimeTotal: 0,
      spinTime: 0,
      ctx: null
    }
  },
  mounted() {
    this.drawRouletteWheel()
    

  },
  methods: {
    setName(event, lastName) {
      this.name = event.target.value + ' ' + lastName;
    },
    drawRouletteWheel() {
     
      const canvas = this.$refs.myCanvas;
      this.ctx = canvas.getContext('2d');
      this.ctx.fillStyle = '#';
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 2;
      this.ctx.clearRect(0, 0, 300, 300);
      this.ctx.beginPath();
      this.ctx.arc(150, 150, 120, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.save();
      this.ctx.translate(150, 150);
      for(let i = 0; i < this.options.length; i++) {
        const angle = this.startAngle + i * this.arc;
        this.ctx.fillStyle = i % 2 === 0 ? '#eaeaea' : '#fff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 100, angle, angle + this.arc);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        this.ctx.save();
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = -1;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = '#fff';
        this.ctx.fillStyle = '#000';
        this.ctx.translate(0, 100);
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        const text = this.options[i];
        this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
        this.ctx.restore();
      }
    this.ctx.restore();
    },
    spin() {
      spinTimeTotal = Math.random() * 3 + 4 * 1000;
      spinTime = 0;
      spinArcStart = Math.random() * 10 + 10;
      this.rotateWheel();
    },
    rotateWheel() {
      spinTime += 30;
      if(spinTime >= spinTimeTotal) {
        this.stopRotateWheel();
        return;
      }
      const spinAngle = spinArcStart - this.easeOut(spinTime, 0, spinArcStart, spinTimeTotal);
      this.startAngle += spinAngle * Math.PI / 180;
      this.drawRouletteWheel();
      spinTimeout = setTimeout(this.rotateWheel, 30);
    },

    easeOut(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    },

    stopRotateWheel() {
      clearTimeout(spinTimeout);
      const degrees = this.startAngle * 180 / Math.PI + 90;
      const arcd = this.arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      this.ctx.save();
      this.ctx.font = 'bold 30px sans-serif';
      const text = this.options[index];
      this.ctx.fillText(text, 150 - this.ctx.measureText(text).width / 2, 150 + 10);
      this.ctx.restore();
    },
    add(num) {
      fetch('https://roulette-db-default-rtdb.firebaseio.com/suervey.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'test',
          rating: 'otherTest'
        })
      }).then(function(response){
        console.log(response);
      });
      this.counter = this.counter + num;
    },
    reduce(num) {
      fetch('https://roulette-db-default-rtdb.firebaseio.com/suervey.json', {
      }).then((response) =>{
        console.log(response)
        if(response.ok){
          return response.json();
        }
      }).then((data) =>{
        console.log(data);
        const results = [];
        for (const id in data){
          results.push({id:id, name: data[id].rating})
        }
        this.result = results;
      });
      this.counter = this.counter - num;
      // this.counter--;
    }
  },
  computed:{
    arc(){
      return  Math.PI / (this.options.length / 2);;
    }
  }
});

app.mount('#events');
