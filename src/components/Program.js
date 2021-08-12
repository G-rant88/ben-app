import React from 'react'
import axios from 'axios'

class Program extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        start: false,
        datasetId: '',
        vehicleIds: [],
        vehicles: [],
        dealerIds: [],
        dealers: [],
        answer: 'Loading...',
        success: '',
        message: '',
        hasRun: false
      };

      this.handleStart = this.handleStart.bind(this);
      this.runAnswer = this.runAnswer.bind(this);
    }

    async handleStart(){
        this.setState({start: true, answer: "Getting datasetId..."})

        let datasetId = await axios.get('https://api.coxauto-interview.com/api/datasetId')
        .then((response) => response.data);

        this.setState({datasetId: datasetId.datasetId, answer: "Getting vehicleIds..."})

        let vehicleIds = await axios.get(`https://api.coxauto-interview.com/api/${this.state.datasetId}/vehicles`)
        .then((response) => response.data)

        this.setState({vehicleIds: vehicleIds.vehicleIds, answer: "Getting vehicles and dealers..."})
        
        for(let vehicleId of this.state.vehicleIds){
            axios.get(`https://api.coxauto-interview.com/api/${this.state.datasetId}/vehicles/${vehicleId}`)
            .then((response) => {
                let vehicle = response.data;
                if(this.state.dealerIds.indexOf(vehicle.dealerId) < 0){
                    this.setState({ dealerIds: [...this.state.dealerIds, vehicle.dealerId] })
                    axios.get(`https://api.coxauto-interview.com/api/${this.state.datasetId}/dealers/${vehicle.dealerId}`)
                    .then((response) => {                 
                        this.setState({ dealers: [...this.state.dealers, response.data] })
                        if(this.state.vehicles.length === 9 && this.state.dealers.length === 3 && this.state.hasRun === false){
                            this.setState({ hasRun: true })
                            this.runAnswer();
                        }
                    })
                }
                this.setState({ vehicles: [...this.state.vehicles, vehicle] })
                if(this.state.vehicles.length === 9 && this.state.dealers.length === 3 && this.state.hasRun === false){
                    this.setState({ hasRun: true })
                    this.runAnswer();
                }
            }) 
        }
    }

    async runAnswer(){
        this.setState({answer: "Posting answer..."})
        for(let dealer of this.state.dealers){
            let vehicles = this.state.vehicles.filter(vehilce => vehilce.dealerId === dealer.dealerId);
            dealer.vehicles = vehicles;
        }

        let postObj = {
            dealers: this.state.dealers
        }

        let answer = await axios.post(`https://api.coxauto-interview.com/api/${this.state.datasetId}/answer`, postObj)
        .then((response) => response.data)

        let answerStr = `Total Milliseconds: ${answer.totalMilliseconds}`;
        let successStr = `Success: ${answer.success}`;
        let messageStr = `Message: ${answer.message}`;
        this.setState({answer: answerStr, success: successStr, message: messageStr})
    }
  
    render() {
      return (
        <div>
            { this.state.start ? 
            <div>
                <h2>{this.state.success}</h2>
                <h2>{this.state.message}</h2>
                <h2>{this.state.answer}</h2> 
            </div>
            : 
                <button onClick={this.handleStart}>Start Program</button>
            }

        </div>
      );
    }
  }

  export default Program;