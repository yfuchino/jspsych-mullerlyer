/*
 * jspsych-mullerlyer
 * Yutaka Fuchino 28, Aug, 2020
 * plugin for displaying a Muller-Lyer task and getting a keyboard response
 */

jsPsych.plugins["mullerlyer-keyboard-response"] = (function() {
    var plugin = {};
    plugin.info = {
        name: "mullerlyer-keyboard-response",
        description: '',
        parameters: {
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below the stimulus.'
            },
            prompt_location: {
                type: jsPsych.plugins.parameterType.SELECT,
                pretty_name: 'Prompt location',
                options: ['above','below'],
                default: 'above',
                description: 'Indicates whether to show prompt "above" or "below" the sorting area.'
            },
            button_label: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Button label',
                default:  'Continue',
                description: 'The text that appears on the button to continue to the next trial.'
            },
            wing_ang: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Wing angle',
                default: 45,
                description: 'How much degrees is wings angle.'
            },
            wing_lngth: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Wing length',
                default: 100,
                description: 'what is the length of wings angle(px).'
            },
            reference_lngth: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'horizontal line lngth',
                default: 250,
                description: 'what is the length of horizontal line(px).'
            },
            xaxis: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'first x-axis of center wing',
                default: 100,
                description: 'where is the first x-axis of center wing(px).'
            }
        }
    }
    
    plugin.trial = function(display_element, trial) {
        
        var start_time = performance.now();
              

        var html = "";
        // check if there is a prompt and if it is shown above
        if (trial.prompt !== null && trial.prompt_location == "above") {
        html += trial.prompt;
        }

        html += '<div id="stage" style="position: relative; width:800px; height:240px;margin: 0 auto; "></div>';

        // check if prompt exists and if it is shown below
        if (trial.prompt !== null && trial.prompt_location == "below") {
        html += trial.prompt;
        }

        display_element.innerHTML = html;

        // store initial location data
        var init_location = trial.xaxis;

 
        display_element.innerHTML += '<button id="jspsych-mullerlyer-done-btn" class="jspsych-btn">'+trial.button_label+'</button>';

        

        display_element.querySelector('#jspsych-mullerlyer-done-btn').addEventListener('click', function(){

            var end_time = performance.now();
            var rt = end_time - start_time;
            // gather data
            // get final position of all objects
            var final_location = trial.xaxis;
            
      
            var trial_data = {
                "rt": rt,
                "wing_angle": JSON.stringify(trial.wing_ang),
                "wing_length": JSON.stringify(trial.wing_lngth),
                "reference_length": JSON.stringify(trial.reference_lngth),
                "init_length": JSON.stringify(init_location)-100-trial.reference_lngth,
                "final_length": JSON.stringify(final_location)-100-trial.reference_lngth
            };
      
            // advance to next part
            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);
        });
        
        
        // myler-lyer
            var stage = acgraph.create('stage');
            // drawback();
            // drawArrowCenter(trial.xaxis);

            drawback();
            drawArrowRight(trial.xaxis);


            //key input
            document.onkeydown = keydown;
            function keydown(e){
                e.preventDefault();
                if(e.keyCode===37){
                    if(trial.xaxis > trial.reference_lngth +100 ){
                        trial.xaxis -= 1;
                        stage.removeChildAt(5)
                        stage.removeChildAt(6)
                        stage.removeChildAt(7)
                        drawArrowRight(trial.xaxis);
                    }
                }else if(e.keyCode===39){
                    if(trial.xaxis < 800){
                        trial.xaxis += 1;
                        stage.removeChildAt(5)
                        stage.removeChildAt(6)
                        stage.removeChildAt(7)
                        drawArrowRight(trial.xaxis);
                    }
                }
            }

            function drawArrowRight(xax){ // right wing
                stage.path().moveTo(trial.reference_lngth+100, 120).lineTo( xax, 120).stroke("#000000", "1");
                stage.path().moveTo(xax, 120).lineTo( -trial.wing_lngth + xax, 120)
                .rotate(trial.wing_ang, xax, 120).stroke("#000000", "1");// upper wing
                stage.path().moveTo(xax, 120).lineTo( -trial.wing_lngth + xax, 120)
                .rotate(-trial.wing_ang, xax, 120).stroke("#000000", "1");// lower wing
        
            };



            function drawback(){
                // line to 100~reference_lngth+100 default length:250px
                stage.path().moveTo(100, 120).lineTo( trial.reference_lngth+100, 120).stroke("#000000", "1");

                stage.path().moveTo(trial.reference_lngth+100, 120)
                .lineTo( trial.wing_lngth + trial.reference_lngth+100, 120)
                .rotate(trial.wing_ang, trial.reference_lngth+100, 120)
                .stroke("#000000", "1");// center lower wing
                stage.path().moveTo(trial.reference_lngth+100, 120)
                .lineTo( trial.wing_lngth + trial.reference_lngth+100, 120)
                .rotate(-trial.wing_ang, trial.reference_lngth+100, 120)
                .stroke("#000000", "1");// center upper wing
                stage.path().moveTo(100, 120)
                .lineTo( -trial.wing_lngth + 100, 120)
                .rotate(trial.wing_ang, 100, 120)
                .stroke("#000000", "1");//  left upper wing
                stage.path().moveTo(100, 120)
                .lineTo( -trial.wing_lngth + 100, 120)
                .rotate(-trial.wing_ang, 100, 120)
                .stroke("#000000", "1");// left lower wing
            };
        // });
    };

    
    return plugin;
})();
