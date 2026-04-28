import React,{useState,useRef,useEffect} from 'react'
import Client from './Client'
import Editor from './Editor'
import {initSocket} from '../socket'
import {useNavigate,useLocation,useParams,Navigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import { FaPlay } from 'react-icons/fa'
import {Base64} from 'js-base64'

function Editorpage() {
  const[clients,setClient]=useState([])
    const socketRef=useRef(null)
    const location=useLocation()
    const {roomId}=useParams()
    const navigate=useNavigate()
    const [code,setCode]=useState('')
    const [language,setLanguage]=useState('javascript')
    const [output,setOutput]=useState('')
    const [input,setInput]=useState('')
    useEffect(()=>{
      const init = async()=>{
          const handleError =(e)=>{
          console.log('socket error=>',e)
          toast.error("Socket Connection Failed!")
          navigate("/")
        }
        socketRef.current=await initSocket()
        socketRef.current.on('connect_error',(err)=>handleError(err))
        socketRef.current.on('connect_failed',(err)=>handleError(err))
        
        socketRef.current.on('joined',({clients,username,socketId})=>{
            if(username!==location.state?.username){
                toast(`${username} Joined`,{icon:'🤝',style:{background:'#000',color:'#fff'}})
              }
              setClient(clients)
        })
        socketRef.current.on('code-change',({code:newCode})=>{
          if(newCode!=null){
            setCode(newCode)
          }
        })
        socketRef.current.on('language-change',({language:newLanguage})=>{
          if(newLanguage){
            setLanguage(newLanguage)
          }
        })
        //disconnected
        socketRef.current.on("disconnected",({socketId,username})=>{
          toast(`${username} Left`,{icon:'👋',style:{background:'#000',color:'#fff'}})
          setClient((prev)=>{
            return prev.filter(
              (client)=>client.socketId!=socketId)
          })
        })
        socketRef.current.on('run-output',({output})=>{
          try{
            const decodedOutput=Base64.decode(output)
            setOutput(decodedOutput)
          }catch(e){
            setOutput(output)
          }
        })

        socketRef.current.emit('join',{
          roomId,
          username:location.state?.username,
        })
      }
      init()

      return ()=>{
        socketRef.current.disconnect()
        socketRef.current.off("joined")
        socketRef.current.off("disconnected")
        socketRef.current.off("code-change")
        socketRef.current.off("language-change")
        socketRef.current.off("run-output")
      }
    },[])
    const handleCodeChange=(newCode)=>{
      setCode(newCode)
      if(socketRef.current){
        socketRef.current.emit('code-change',{
          roomId,
          code: newCode
        })
      }
    }

    const handleLanguageChange=(newLanguage)=>{
    setLanguage(newLanguage)
    if(socketRef.current){
        socketRef.current.emit('language-change',{ roomId, language: newLanguage})
    }
};
    const handleRunCode=()=>{
      setOutput('Executing...')
      const sourceCode=code
      if(socketRef.current){
        socketRef.current.emit('run-code',{roomId,language,sourceCode,stdin: input})
      }
    }
    const copyRoomId=async()=>{
      try{
        await navigator.clipboard.writeText(roomId)
        toast.success('Id Saved')
      }catch (error){
        toast.error("Unable To Get Id")
      }
    }
    const leaveRoom=()=>{
      navigate("/")
    }
    if(!location.state){
      return <Navigate to="/"/>
    }
  return (
    <div className="container-fluid vh-100"
    style={{padding:0}}>
        <div className="row h-100 g-0">
            <div className="col-md-2 text-light d-flex flex-column h-100" 
            style={{boxShadow:"2px 0px 4px rgba(0,0,0,0.1)"}}>
             <img src="/images/FullLogo1.png"
             alt="DevTogether"
             className="img-fluid mx-auto"
             />
             <hr style={{marginTop:"1px"}}/>
             {/* client list container */}
             <div className="d-flex flex-column overflow-auto p-2">
              {clients.map((client)=>(
                  <Client key={client.socketId} username={client.username}/>
              ))}
             </div>
                {/* buttons */}
                <div className="mt-auto d-flex flex-column p-4">
                  <hr />
                  <button onClick={copyRoomId} className="btn btn-success">
                      Copy Id
                  </button>
                  <button onClick={leaveRoom} className="btn btn-danger mt-2 mb-2 px-3 btn-block">
                      Leave Room
                  </button>
                </div>
            </div>
            {/* Editor */}
             <div className="col-md-10 bg-black text-light d-flex flex-column h-100">
              <div className="editor-toolbar d-flex justify-content-center align-items-center p-2 position-relative">
               <div style={{ width: "550px" }}></div>
                <select 
        className="form-select form-select-sm"
        style={{
            width: 'auto',
            backgroundColor: '#282a36',
            color: '#f8f8f2',
            borderColor: '#44475a'
        }}
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
    >
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
    </select>
            <button className="btn btn-success btn-sm ms-auto"
            onClick={handleRunCode}
            style={{display:'flex',alignItems:'center'}}
            >
              <FaPlay style={{marginRight: '5px'}}/>
        Run Code
    </button>
              </div>
                <div className="editor-wrapper" style={{ flexGrow: 1, overflow: 'auto', height: '100%' }}>
                   <Editor 
                   language={language}
                   value={code}
                   onChange={handleCodeChange}
                   />
                </div>
    <div className="d-flex" style={{ height: '200px' }}>
           {/* Input Panel */}
             <div className="input-panel p-2 d-flex flex-column" style={{ flex: '1 1 50%', backgroundColor: '#1e1e1e', borderRight: '1px solid #44475a' }}>
                <h3 style={{ fontSize: '1rem', color: '#aaa' }}>Input:</h3>
                   <textarea
                   className="form-control"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                  style={{ flexGrow: 1, backgroundColor: '#282a36', color: '#f8f8f2', border: 'none', resize: 'none' }}
                  ></textarea>
              </div>

            {/* Output Panel */}
              <div className="output-panel p-2" style={{ flex: '1 1 50%', backgroundColor: '#1e1e1e', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1rem', color: '#aaa' }}>Output:</h3>
                   <pre style={{ color: '#f8f8f2', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                     {output}
                    </pre>
                </div>
              </div>
              </div>
        </div>
    </div>
  )
}

export default Editorpage
