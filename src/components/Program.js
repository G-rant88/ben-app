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
        dealersAnswer: [],
        answer: 'Loading...'
      };

      this.handleStart = this.handleStart.bind(this);
    }

    async handleStart(){
        this.setState({start: true, title: "Loading..."})

        let datasetId = await axios.get('http://api.coxauto-interview.com/api/datasetId')
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        })

        this.setState({datasetId: datasetId.datasetId})

        let vehicleIds = await axios.get(`http://api.coxauto-interview.com/api/${this.state.datasetId}/vehicles`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        })

        this.setState({vehicleIds: vehicleIds.vehicleIds})
        
        for(let vehicleId of this.state.vehicleIds){
            let vehicles = await axios.get(`http://api.coxauto-interview.com/api/${this.state.datasetId}/vehicles/${vehicleId}`)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            })
            this.setState({ vehicles: [...this.state.vehicles, vehicles] })
        }

        for(let vehicle of this.state.vehicles){
            if(this.state.dealerIds.indexOf(vehicle.dealerId) < 0){
                this.setState({ dealerIds: [...this.state.dealerIds, vehicle.dealerId] })
            }
        }

        for(let dealerId of this.state.dealerIds){
            let dealers = await axios.get(`http://api.coxauto-interview.com/api/${this.state.datasetId}/dealers/${dealerId}`)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            })
            this.setState({ dealers: [...this.state.dealers, dealers] })
        }

        for(let dealer of this.state.dealers){
            let vehicles = this.state.vehicles.filter(vehilce => vehilce.dealerId === dealer.dealerId);
            let dealerObj = {
                dealerId: dealer.dealerId,
                name: dealer.name,
                vehicles: vehicles
            }
            this.setState({ dealersAnswer: [...this.state.dealersAnswer, dealerObj] })
        }

        let postObj = {
            dealers: this.state.dealersAnswer
        }

        let answer = await axios.post(`http://api.coxauto-interview.com/api/${this.state.datasetId}/answer`, postObj)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        })

        let answerStr = `Total Milliseconds: ${answer.totalMilliseconds}`;
        this.setState({answer: answerStr})

    }
  
    render() {
      return (
        <div>
            { this.state.start ? 
                <h2>{this.state.answer}</h2> 
            : 
                <button onClick={this.handleStart}>Start Program</button>
            }

        </div>
      );
    }
  }

  export default Program;