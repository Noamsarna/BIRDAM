var jsCountDots = (function (jspsych) {
  "use strict";

  const info = {
		name: 'countDots',
		parameters: {
              stim_time: {
                type: jspsych.ParameterType.INT,
                default: 300,
              },
              post_click_time: {
                type: jspsych.ParameterType.INT,
                default: 500,
              },
              bigger_side: {
                type: jspsych.ParameterType.STRING,
                default: 'left',
              },
              increment: {
                type: jspsych.ParameterType.INT,
                default: 100,
              },
              min_conf_time: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Minimum confidence time",
                default: 200,
                description: "Minimum time to rate confidence (to avoid hasty responding)"
              }

		}
	}

  /**
   * **PLUGIN-NAME**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author MATAN MAZOR
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class CountDotsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

    //   display_element.innerHTML = '<div id="p5_loading" style="font-size:60px">+</div>';

      //open a p5 sketch
      let sketch = (p) => {

        const du = p.min([window.innerWidth, window.innerHeight, 600])/2 //drawing unit

        window.trial_part ='stimulus';

        const p_function = (frame_number)=>{return (trial.present*trial.max_p)/(1+Math.exp(-trial.steepness*(frame_number-trial.latency)))}

        var draw_choices = (response) => {

            p.push()
            p.rectMode(p.CENTER, p.CENTER);
            if (trial.response=='left') {
                p.strokeWeight(4)
            } else(
                p.strokeWeight(2)
            )
            p.stroke(0)
            p.noFill()

            p.translate(-du*2/3,0)
            p.rect(0,0,du,du)

            if (trial.response=='right') {
                p.strokeWeight(4)
            } else(
                p.strokeWeight(2)
            )
            p.translate(du*2/3*2,0)
            p.rect(0,0,du,du)
            p.pop()

        }

        var draw_dots = (response) => {


           for (let y = 0; y < 25; y++) {
              for (let x = 0; x < 25; x++) {
                if (window.left_array.includes(y*25+x)) {
                    p.push()
                    p.fill(0)
                    p.translate(-du*7/6+x*du/25,-du/2+y*du/25)
                    p.ellipse(0,0,du/25,du/25)
                    p.pop()
                }
              }
            }

            for (let y = 0; y < 25; y++) {
                for (let x = 0; x < 25; x++) {
                    if (window.right_array.includes(y*25+x)) {
                    p.push()
                    p.fill(0)
                    p.translate(du/6+x*du/25,-du/2+y*du/25)
                    p.ellipse(0,0,du/25,du/25)
                    p.pop()
                    }
                }
              }
        }

        
          // confidence ratings
          var rate_confidence = (confidence) => {

            p.background(128);

            window.dial_position = p.max(p.min(p.mouseX,window.innerWidth*3/4),window.innerWidth/4);
            // draw scale
            p.push()
            p.stroke(0);
            p.strokeWeight(4);
            p.line(window.innerWidth/4, window.innerHeight/2, window.innerWidth*3/4, window.innerHeight/2)
            p.pop()

            // add labels
            p.push()
            p.textAlign(p.CENTER)
            p.textSize(30)
            p.textFont('Quicksand');
            p.text('Certainly correct',window.innerWidth*3/4,window.innerHeight/2+70)
            p.text('Guessing',window.innerWidth/4,window.innerHeight/2+70)
            p.pop()

            if (window.mouseMoved) {
              // draw dial
              p.push()
              p.stroke(0);
              p.strokeWeight(0.5);
              p.fill(255)
              p.ellipseMode(p.CENTER)
              p.ellipse(window.dial_position,window.innerHeight/2,20)
              p.pop()
            }

          }

      

        //sketch setup
        p.setup = () => {
          p.createCanvas(window.innerWidth, window.innerHeight);
          p.fill(255); //white
          p.strokeWeight(0)
          p.background(128); //gray
          p.frameRate(trial.frame_rate);
          p.rectMode(p.CENTER);
          p.ellipseMode(p.CORNER)
          p.noCursor();
          window.trial_part=='presenting_stim'
          trial.response  = NaN;
          trial.RT = Infinity;
          trial.conf_RT = Infinity;
          window.confidence=-1;
          window.mouseMoved=false;

          if (trial.bigger_side=='left') {
            window.left_array = p.shuffle([...Array(625).keys()]).slice(0,313+trial.increment)
            window.right_array = p.shuffle([...Array(625).keys()]).slice(0,313)
          } else if (trial.bigger_side=='right') {
            window.left_array = p.shuffle([...Array(625).keys()]).slice(0,313)
            window.right_array = p.shuffle([...Array(625).keys()]).slice(0,313+trial.increment)
          }

        //   for (let y = 0; y < this.img.height; y++) {
        //     var row = [];
        //     for (let x = 0; x < this.img.width; x++) {
        //       row.push(this.img.get(x,y))
        //     }
        //     window.img_pixel_data.push(row);
        //   }

          window.start_time = p.millis()
        }

        p.draw = () => {
          if (p.millis()-window.start_time < trial.stim_time) {
            p.background(128); //gray
            p.translate(window.innerWidth/2,window.innerHeight/2)
            draw_choices()
            draw_dots() 
          } else if (p.millis()-window.start_time < trial.RT + trial.post_click_time) {
            p.background(128); //gray
            p.translate(window.innerWidth/2,window.innerHeight/2)
            draw_choices(trial.response)
          } else if (window.confidence==-1)  {
            window.trial_part = 'rating confidence';
            rate_confidence(window.confidence)
          } else {
            //console.log(window.trial_data)
            p.remove()
            // end trial
            this.jsPsych.finishTrial(window.trial_data);
          }
        }

        p.keyReleased = () => {
          // it's only possible to query the key code once for each key press,
          // so saving it as a variable here:
          var key_code = p.keyCode
          var key = String.fromCharCode(key_code).toLowerCase();
          if ((key=='s' | key=='f') & trial.RT==Infinity) {
            // only regard relevant key presses during the response phase
              trial.response = key=='s'? 'left':'right';
              //console.log(trial.response)
              trial.RT = p.millis()-window.start_time;
              // data saving
              window.trial_data = {
                presented_pixel_data: window.presented_pixel_data,
                RT: trial.RT,
                response: trial.response,
                right_array: window.right_array,
                left_array: window.left_array,
                correct: trial.response==trial.bigger_side
              };
            }
        }

        p.mouseMoved = () => {
          if (window.trial_part=='rating confidence') {
            window.mouseMoved=true;
          }
        }

        // confidence data saving
        p.mouseClicked = () => {
          if (window.trial_part=='rating confidence') {
            window.confidence=(window.dial_position-window.innerWidth/4)/(window.innerWidth/2);
            window.trial_data.confidence=window.confidence
            window.trial_data.confidence_RT = p.millis()-window.start_time-trial.RT;
          }
      }

    };


      let myp5 = new p5(sketch);
    }
  }
  CountDotsPlugin.info = info;

  return CountDotsPlugin;
})(jsPsychModule);
