import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"



const HeatMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAJDPlw98mkTp7Lo6cEZTxE7QO9AOjbPvY&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `540px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  function getZoomValue(){
    let zoomVal = this.getZoom()
    props.getZoomValue(zoomVal)
  }
  return(
    <GoogleMap
      defaultZoom={props.mapVariable.zoom}
      zoom={props.mapVariable.zoom}
      center={props.mapVariable.center}
      onZoomChanged={getZoomValue}
    >
      {/* <MarkerClusterer
        averageCenter
        enableRetinaIcons
        defaultZoomOnClick
        averageCenter
        gridSize={100}
      > */}
      {props.positions.map((i,index) => {
        let coordinates = { lat: parseFloat(i.lat, 10), lng: parseFloat(i.lng, 10) }
        return <Marker key={index} position={coordinates} title={`${i.count} candidates`} onClick={props.zoomToPin}/>
      })}
      {/* </MarkerClusterer> */}
    </GoogleMap>
  )
})

export default HeatMap