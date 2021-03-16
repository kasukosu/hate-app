import React, {useState} from 'react';
import {motion} from 'framer-motion';
import Cropper from 'react-easy-crop';
import {getCroppedFile} from './functions/crop';

const innerVariants = {
    hidden: {
        scale: 1,
        y:-120,
        x:-120,
        opacity: 0,

    },
    visible:{
        scale: 1,
        opacity:1,
        y: 0,
        x: 0,
    },
    exit:{
        opacity: 0,
        y:-120,
        x:-120,
        scale: 0.2,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}
const ImageEditor = (props) => {
    const {image} = props;
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(1);


    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        console.log(croppedAreaPercentage, croppedAreaPixels);
        setCroppedArea(croppedAreaPixels);
    }

    const onImageSave = () => {
        console.log(image);
        getCroppedFile(image, croppedArea).then((file) => {
            const imgFile = file.toDataURL("image/jpeg");
            console.log(imgFile);
            props.setCroppedImage(imgFile);
            props.setPreview(imgFile);
            props.setImage(null);
        }

        );

     }

    return (
        <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal-main cropper">
                <div className="cropper-container">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="control-container">
                    <div className="slidecontainer">
                        <input type="range" min="1" max="3" value={zoom} step={0.01} className="slider" id="zoom" onChange={(e) => setZoom(e.target.value)}/>
                    </div>
                    <div className="slidecontainer">
                        <input type="range" min="0" max="360" value={rotation} step={1} className="slider" id="rotation" onChange={(e) => setRotation(e.target.value)}/>
                    </div>
                    <div className="btn-group">
                        <motion.button whileHover={{backgroundColor: 'rgb(4,174,79)'}} transition={{duration:0.15}}  type="submit" className="save" onClick={onImageSave} >Save</motion.button>
                        <motion.button whileHover={{backgroundColor: 'rgb(237, 94, 104)'}} transition={{duration:0.15}} onClick={()=> {props.setImage(false)}} className="discard">Discard</motion.button>
                    </div>
                </div>

        </motion.section>
      );
}

export default ImageEditor;