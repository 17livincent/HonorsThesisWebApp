/**
 * Confirm.js
 * @author Vincent Li <vincentl@asu.edu>
 * Displays the selected files, selected steps, and accepts confirmation.
 */

import React from 'react';
import {Alert, Button, Form} from 'react-bootstrap';

import Transformations from './Transformations.js';
import Util from './Util.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Confirm.css';

class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.submitOptions = this.props.submitOptions;

        this.onConfirm = this.onConfirm.bind(this);
    }
    /**
     * Returns a component with the names of the files chosen
     */
    displayFiles() {
        return (
            this.props.files.length > 0 && this.props.files.map((file) => 
                <React.Fragment>
                    {file.name}<br />
                </React.Fragment>
            )   // remove the fakepath if its there
        );
    }

    /**
     * Returns a component with the sequences of chosen steps and their inputs
     */
    displaySteps() {
        let trans = new Transformations();
        let transformations = trans.getTransformations();
        let steps = this.props.steps;
        let counter = 0;
        return steps.map((i) => {
            counter++;
            // find the index of this step
            let index = trans.getStepIndex(i.name);
            // get the step name
            let stepName = transformations[index].name;
            // get the input names and inputs
            let inputInfo;
            if(transformations[index].numOfInputs !== 0) {
                let inputNames = transformations[index].inputNames.slice();
                let inputs = i.inputs.slice();
                inputInfo = Util.range(0, transformations[index].numOfInputs - 1, 1).map((j) => (<React.Fragment>{inputNames[j]}={inputs[j]}&ensp;</React.Fragment>));
            }
            return (
                <React.Fragment>
                    {counter}: <b>{stepName}</b>&emsp;{inputInfo}<br />
                </React.Fragment>
            );
        });
    }

    /**
     * Notifies the parent component that the preprocessing steps are ready to be done
     */
    onConfirm(event) {
        event.preventDefault();
        this.props.onSubmit(this.submitOptions);
    }

    /**
     * Update submitOptions above
     */
    updateSubmitOptions(value, option) {
        if(option === 'd') {
            if(value === true) this.submitOptions.download = 1;
            else this.submitOptions.download = 0;
        }
        if(option === 'v') {
            if(value === true) this.submitOptions.visualizations = 1;
            else this.submitOptions.visualizations = 0;
        }
        this.props.updateSubmitOptions(this.submitOptions);
    }

    render() {
        let inputDataSummary = <Alert variant='dark'><h4>Files chosen:</h4>{this.displayFiles()}</Alert>;
        let stepsSummary = <Alert variant='dark'><h4>Steps chosen:</h4>{this.displaySteps()}</Alert>;

        return (
            <React.Fragment>
                {inputDataSummary}
                {stepsSummary}
                <div id='submitOptions'>
                    <Form>
                        <Form.Check
                            label='Download datasets' type='checkbox' disabled={this.props.optionsDisabled}
                            onChange={(e) => this.updateSubmitOptions(e.target.checked, 'd')} />
                        <Form.Check
                            label='Display visualizations' disabled={this.props.optionsDisabled}
                            type='checkbox' onChange={(e) => this.updateSubmitOptions(e.target.checked, 'v')} />
                        <br />
                    </Form>
                </div>
                
                <Button id='confirmButton' variant='primary' size='lg' onClick={this.onConfirm} 
                    disabled={this.props.buttonDisabled}>
                    Run
                </Button>
            </React.Fragment>
        );
    }

}

export default Confirm;