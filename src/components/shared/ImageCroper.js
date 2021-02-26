import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { postCall } from '../../utils/api.config';
import { HEAD_SHOT } from '../../utils/constants';
import store from '../../redux/store';
import { updateProfilePic } from '../../redux/actions/index'
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';

class ImageCroper extends React.Component {
    constructor(props) {
    super(props)
        const { media } = this.props
        this.state = {
            src: null,
            crop: {
                unit: 'px',
                width: 130,
                aspect: 1 / 1
            },
            showImageCampure: false,
            headshot: (media && media.headshot) ? media.headshot : require('../../images/icons/placeholder-profile.jpg')
        };
        this.videoConstraints = {
            facingMode: "user"
        };
        this.webcamRef = React.createRef();
    }
    capture = () => {
        const imageSrc = { file: this.webcamRef.current.getScreenshot(), filename: 'headshot' };
        this.setState({src:imageSrc.file, showImageCampure: false})
    }
    headshotFailed = () => { }
    onSelectFile = e => {
        this.setState({showImageCampure: false})
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    onImageLoaded = image => {
        this.imageRef = image;
    };
    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };
    onCropChange = (crop) => {
        this.setState({ crop });
    };
    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'profile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }
    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                this.setState({ croppedBlob: blob })
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }
    getProfileUrl = () => {
        let blob = this.state.croppedBlob
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            let imageSrc = reader.result;
            postCall(HEAD_SHOT, { file: imageSrc, filename: 'profile' }, { sfn: this.profileSetSuccess, efn: this.profileSetFailed })
        }
    }
    profileSetFailed = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    displayCapture = () => {
        this.setState({ showImageCampure: true })
    }
    profileSetSuccess = (data) => {
        store.dispatch(updateProfilePic(data.response.location))
        this.props.updatePic(data.response.location)
    }
    removeProfilePic=()=>{
        this.props.updatePic("https://muit-media.s3.amazonaws.com/user-424b5b20-caa9-11ea-a763-f15bf2c98d7d/1598969832744_profile.jpeg")
    }
    render() {
        const { crop, croppedImageUrl, src } = this.state;
        return (
            <div id="ImageCroper">
                <div className="img-croper">
                    <div>
                        <input type="file" accept="image/*" onChange={this.onSelectFile} placeholder="" />
                        <span className='fa fa-times' onClick={this.props.closeEditor}></span>
                    </div>
                    <button type="button" className="btn-rmv-link pic" onClick={this.removeProfilePic}>remove image</button>
                    {this.state.showImageCampure ?
                        <div className="camera-holder">
                            <Webcam
                                audio={false}
                                ref={this.webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={this.videoConstraints}
                                width='100%'
                            />
                        </div>
                        :
                        src ?
                            <ReactCrop
                                src={src}
                                crop={crop}
                                ruleOfThirds
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                            />
                        :
                        <span><img src={this.props.originalPic} className='fit-layout default-crop' alt='' /></span>
                    }
                    {croppedImageUrl && (
                        <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                    )}
                    {this.state.showImageCampure ?
                        <button type="button" className="btn-general" onClick={this.capture}>CAPTURE</button>
                        :
                        <button type="button" className="btn-general" onClick={this.displayCapture}>USE CAMERA</button>
                    }
                    <button type="button" className="btn-general" style={{marginTop:'10px'}} disabled={!this.state.croppedImageUrl} onClick={this.getProfileUrl}>SET</button>
                </div>
            </div>
        );
    }
}

export default ImageCroper;