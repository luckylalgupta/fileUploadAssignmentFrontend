import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {useDropzone} from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import CloudUpload from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';
import { LinearProgress } from '@material-ui/core';
import axios from "axios";
const useStyles = makeStyles((theme)=>({
  dropzoneContainer:{
    height:300,
    background:"#efefef",
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderStyle:'dashed',
    borderColor:'#aaa'
  },
  preview:{
    width:250,
    height:250,
    margin:"auto",
    display:"block",
    marginBottom:theme.spacing(2),
    objectFit:"contain",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}))
function App() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const[file,setFile]= React.useState();
  const[previewUrl,setPreview] = React.useState();
  const[percent,setPercent]=React.useState(0); 
  const[downloadUri,setDownloadUri] = React.useState();
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const onDrop = React.useCallback((acceptedFiles)=>{
    console.log(acceptedFiles)
    setFile(acceptedFiles[0])
    const previewUrl = URL.createObjectURL(acceptedFiles[0]);
    setPreview(previewUrl);
  })
  const {getRootProps,getInputProps}=useDropzone({
    multiple:false,
    onDrop
  })
  const {ref,...rootProops}=getRootProps()
  const uploadFile = async () => {
    try{
      setSuccess(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("file",file)
      const API_URL="http://localhost:8080/files"
      const response = await axios.put(API_URL,formData,{
        onUploadProgress:(ProgressEvent)=>{
          const percentCompleted = Math.round(ProgressEvent.Loaded*100)/ProgressEvent.total;
          setPercent(percentCompleted);
        }
      });
      setDownloadUri(response.data.fileDownloadUri)
      setSuccess(true)
      setLoading(false);
    }catch(err){
      alert(err.message)
    }
  };
  return (<>
    <CssBaseline/>
    <AppBar position="fixed">
      <Toolbar>
        <TypoGraphy variant="h6">
          React File upload
        </TypoGraphy>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Toolbar />
      <Container maxWidth="md">
        <paper elevation ={4}>
          <Grid container>
            <Grid item xs ={12}>
              <TypoGraphy align ="centre" style={{padding:16}}>
                File Upload
              </TypoGraphy>
              <Divider />
            </Grid>
            <Grid item xs={6} style={{padding:16}}>
              <RootRef rootRef={ref}>
                <Paper {...rootProops} elevation={0}
                className={classes.dropzoneContainer}>
                  <input {...getInputProps()}/>
                  <p>Drag 'n' drop some files here , or click to select files</p>
                </Paper>
              </RootRef>
            </Grid>
            <Grid item xs ={6} style={{padding:16}}>
              <TypoGraphy align="centre" varient ="subtitle1">
                Preview
              </TypoGraphy>
              <img
              onLoad={()=> URL.revokeObjectURL(previewUrl)}
              className={classes.preview}
              src ={previewUrl || "https://via.placeholder.com/250"}
              />
              {/* */}
            { file && <>
              <Divider />
              <Grid container style ={{marginTop:16}} alignItems="centre">
                <Grid item xs ={2}>
                <div className={classes.wrapper}>
                    <Fab
                      aria-label="save"
                      color="primary"
                      className={buttonClassname}
                      onClick={uploadFile}
                    >
                      {success ? <CheckIcon /> : <CloudUpload />}
                    </Fab>
                    {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                  </div>
                </Grid>
                <Grid item xs={10}>
                 {file && ( <TypoGraphy variant ="body">{file.name}</TypoGraphy>
                 )}
                {loading && ( <div>
                    <LinearProgress variant ="determinate" value ={percent} />
                    <div style ={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <TypoGraphy varaiant= "body">{percent}</TypoGraphy>
                    </div>
                  </div>
                )}
                  {success && (
                  <TypoGraphy>
                    File Upload Success!{" "}
                    <a href={downloadUri} target="_blank">
                      File Url
                    </a>
                    </TypoGraphy>
                    )}
                </Grid>
              </Grid>
              {/* */}
              </>
                 }   
            </Grid>
          </Grid>
        </paper>
      </Container>
    </>
  );
}

export default App;
