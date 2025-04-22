'use client';
import AdTextInputs from "@/src/components/AdTextInputs";
import LocationPicker, { Location } from "@/src/components/LocationPicker";
import UploadArea from "@/src/components/UploadArea";
import {faLocationCrosshairs} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { useState } from "react";
import { createAd } from "../actions/adActions";
import SubmitButton from "@/src/components/SubmitButton";

const locationDefault = {
    lat: 35.6,
    lng: 139.7,
}

export default function NewAdPage(){
    const [files, setFiles] = useState<UploadResponse[]>([]);
    const [location, setLocation] = useState<Location>(locationDefault);
    const [gpsCoords, setGpsCoords] = useState<Location|null>(null);

    function handleFindMyPositionClick(){
        navigator.geolocation.getCurrentPosition(ev => {
            const location = {lat: ev.coords.latitude, lng: ev.coords.longitude}
            setLocation(location);
            setGpsCoords(location);
        }, console.error);
        
    }

    function handleFindMyPositionClick1(){
        navigator.geolocation.getCurrentPosition(ev => {
            const location = {lat: ev.coords.latitude, lng: ev.coords.longitude}
            setLocation(location);
            setGpsCoords(location);
        }, console.error);
        
    }

    async function handleSubmit(formData: FormData){
        formData.set('location', JSON.stringify(location));
        formData.set('files', JSON.stringify(files));
        const result = await createAd(formData);
        console.log({result});
    }

    return(
        <form 
        action={handleSubmit}
        className="max-w-xl mx-auto grid grid-cols-2 gap-12">
            <div className="grow pt-8">

                <UploadArea files={files} setFiles={setFiles}/>

                <div className="mt-8">
                    <label htmlFor="">Location</label>
                    <button 
                    type="button"
                    onClick={handleFindMyPositionClick}
                    className="w-full flex text-gray-600 items-center gap-1 py-1 justify-center border border-gray-600 rounded">
                        <FontAwesomeIcon icon={faLocationCrosshairs} />
                        <span>Share current location</span>
                    </button>
                    <div className="mt-2 bg-gray-200 min-h-12 rounded overflow-hidden text-gray-400 text-center">
                        {JSON.stringify(location)}
                        <LocationPicker 
                        defaultLocation ={locationDefault}
                        gpsCoords = {gpsCoords}
                        onChange={location => setLocation(location)}
                        />
                    </div>
                </div>
            </div>

            <div className="grow pt-2">
                <AdTextInputs/>
                <SubmitButton>Publish</SubmitButton>
            </div>
        </form>
    );
}