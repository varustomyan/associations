import React, { useState, useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { auth, firestore } from '../components/firebase/firebase';
import { Grid, Container, Input } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useNavigate } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { addDoc, collection, doc, serverTimestamp, setDoc, getDoc, arrayUnion, updateDoc, onSnapshot, query, where, getDocs  } from 'firebase/firestore';
import { Context } from './../App';
import { queryAllByAltText } from '@testing-library/react';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const RoomPage = () => {
    
  const router = useNavigate()
  const user = useContext(Context);

  const [users, setUsers] = useState([])

  const [room, setRoom] = useState({})

  const [value, setValue] = useState('')
  const [send, setSend] = useState(false)
  const [pos, setPos] = useState()
  const [word, setWord] = useState()
  const [action, setAction] = useState('')

  const docRef = doc(firestore, "Rooms", "room1")

    const [flag, setFlag] = useState(false)

    const [newMessage, setNewMessage] = useState('сообщения отсутствуют((((')
    const [message, setMessage] = useState('Ожидание других игроков')


  useEffect(() => {
    const getRoom = async () => {
        const docSnap = await getDoc(docRef);
        setRoom(docSnap.data())
        setUsers(docSnap.data().users)
    }   
    getRoom() 

    const unsub = onSnapshot(docRef, (doc) => {
        setUsers(doc.data().users)
    
        let i 

        for (let index = 0; index < doc.data().users.length; index++) {
            if (doc.data().users[index].displayName == user.displayName ) {
                setPos(++index)

                i = index

            }
        }

        if(doc.data().associativeRow.length == 0 && i == 1) {
            setAction('Введите персонажа')
            setFlag(true)
        }

        for (let j = 0; j < doc.data().associativeRow.length; j++) {
            
            if (doc.data().associativeRow[j].user.to == user.displayName && !doc.data().associativeRow[j + 1]) {
                setAction('С чем у вас ассоциируется: ')
                setFlag(true)
                setWord(doc.data().associativeRow[j].word)
            }
        }
        
        console.log(doc.data().associativeRow)
        return
    });



}, [user])

const joinRoom = async () => {
    console.log('начата запись')
    const docRef78 = await updateDoc(docRef, {
        users: arrayUnion(
            {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
        })
           
    }).catch(err => console.log(err));
    console.log('записан')
}

const getRoom = async () => {
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
}   






const addWord = async () => {
    setMessage('Отравка...')
    setFlag(false)
    await updateDoc(docRef, {
        associativeRow: arrayUnion({
            user: {
                from: user.displayName,
                to: users[pos] ? users[pos].displayName : 'end',
            },
            word: value
        })
    }).catch(err => console.log(err));
    setMessage('Отправлено')
}

  return (

  <div>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <button onClick={()=> router('/')}>
                <svg 
                style={{marginRight: '30px'}}
            width="150" height="24" viewBox="0 0 609 97" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.704 84.8L0.712 95.04C1.352 69.312 5.576 44.864 5.576 44.864C5.576 44.864 8.904 26.56 17.736 6.976L31.304 13.12C40.776 25.92 46.792 46.272 46.792 46.272C46.792 46.272 52.936 66.496 52.296 85.44L44.744 84.032C44.488 79.936 43.848 70.336 42.696 63.68C35.016 63.936 29.256 64.576 21.96 67.52L21.704 84.8ZM29.128 25.28L22.856 58.688C27.592 57.28 35.912 56.768 40.264 56.896C37.96 45.376 32.968 32.192 29.128 25.28ZM86.682 7.35999L89.754 12.224C70.426 20.8 75.93 34.624 75.93 34.624C80.282 43.584 101.658 51.392 103.066 67.776C103.066 67.776 101.402 94.528 58.394 96.96L58.778 87.104C80.794 85.056 79.514 74.944 79.514 74.944C78.234 60.992 55.322 59.84 54.298 43.456C54.298 43.456 49.178 21.696 86.682 7.35999ZM137.557 7.35999L140.629 12.224C121.301 20.8 126.805 34.624 126.805 34.624C131.157 43.584 152.533 51.392 153.941 67.776C153.941 67.776 152.277 94.528 109.269 96.96L109.653 87.104C131.669 85.056 130.389 74.944 130.389 74.944C129.109 60.992 106.197 59.84 105.173 43.456C105.173 43.456 100.053 21.696 137.557 7.35999ZM179.088 12.736C193.808 11.84 205.84 27.456 204.56 35.648C203.28 43.968 196.88 60.48 185.488 61.12C173.968 61.76 161.296 52.16 159.376 37.568C157.456 22.976 168.848 13.376 179.088 12.736ZM172.048 33.088C171.408 37.568 176.528 40.768 182.288 40.768C188.048 40.768 189.968 34.368 189.968 30.528C189.968 26.816 186.768 22.464 181.008 22.976C173.328 23.616 172.688 28.736 172.048 33.088ZM256.462 20.928C248.142 10.944 235.47 10.944 235.47 10.944C222.67 10.944 208.718 16.576 207.694 43.072C206.542 70.848 223.822 82.496 238.158 82.496C238.158 82.496 252.622 82.496 259.79 70.336L253.774 67.52C228.814 90.304 228.174 47.04 228.174 47.04C228.174 47.04 227.662 0.191994 252.11 27.072L256.462 20.928ZM281.51 32.704L272.678 29.76C268.966 38.336 271.91 79.04 273.318 86.208L284.71 83.776C283.942 80.192 279.718 39.872 281.51 32.704ZM264.486 17.856C264.486 11.712 272.806 6.848 279.974 6.848C287.27 6.848 289.702 13.376 289.702 19.648C289.702 25.92 283.686 27.968 276.39 27.968C269.222 27.968 264.486 24.128 264.486 17.856ZM314.454 84.8L293.462 95.04C294.102 69.312 298.326 44.864 298.326 44.864C298.326 44.864 301.654 26.56 310.486 6.976L324.054 13.12C333.526 25.92 339.542 46.272 339.542 46.272C339.542 46.272 345.686 66.496 345.046 85.44L337.494 84.032C337.238 79.936 336.598 70.336 335.446 63.68C327.766 63.936 322.006 64.576 314.71 67.52L314.454 84.8ZM321.878 25.28L315.606 58.688C320.342 57.28 328.662 56.768 333.014 56.896C330.71 45.376 325.718 32.192 321.878 25.28ZM366.888 87.36L387.496 80.064C388.136 47.552 389.032 27.968 391.848 19.52L409.64 17.088L411.432 8.384C388.52 6.464 352.936 11.84 345 15.04L347.304 21.824L370.472 20.928C367.528 29.888 364.84 64.192 366.888 87.36ZM433.135 32.704L424.303 29.76C420.591 38.336 423.535 79.04 424.943 86.208L436.335 83.776C435.567 80.192 431.343 39.872 433.135 32.704ZM416.111 17.856C416.111 11.712 424.431 6.848 431.599 6.848C438.895 6.848 441.327 13.376 441.327 19.648C441.327 25.92 435.311 27.968 428.015 27.968C420.847 27.968 416.111 24.128 416.111 17.856ZM466.463 12.736C481.183 11.84 493.215 27.456 491.935 35.648C490.655 43.968 484.255 60.48 472.863 61.12C461.343 61.76 448.671 52.16 446.751 37.568C444.831 22.976 456.223 13.376 466.463 12.736ZM459.423 33.088C458.783 37.568 463.903 40.768 469.663 40.768C475.423 40.768 477.343 34.368 477.343 30.528C477.343 26.816 474.143 22.464 468.383 22.976C460.703 23.616 460.063 28.736 459.423 33.088ZM527.325 76.736L509.661 88C502.237 76.48 498.781 47.04 498.781 47.04C498.781 47.04 495.965 23.616 501.853 6.336L523.229 14.528L520.541 28.864L544.349 62.784C547.805 40.768 544.733 30.528 544.733 30.528C544.733 30.528 541.661 20.416 539.613 11.2L546.781 6.07999C555.869 23.36 554.845 44.864 554.845 44.864C554.845 44.864 553.821 66.24 550.877 84.544L541.661 78.528C534.493 66.624 529.373 57.408 529.373 57.408C529.373 57.408 524.253 48.192 519.261 43.84C519.389 49.856 521.181 58.304 521.181 58.304C521.181 58.304 523.229 68.288 527.325 76.736ZM591.932 7.35999L595.004 12.224C575.676 20.8 581.18 34.624 581.18 34.624C585.532 43.584 606.908 51.392 608.316 67.776C608.316 67.776 606.652 94.528 563.644 96.96L564.028 87.104C586.044 85.056 584.764 74.944 584.764 74.944C583.484 60.992 560.572 59.84 559.548 43.456C559.548 43.456 554.428 21.696 591.932 7.35999Z" fill="white"/>
                </svg>   
            </button>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', marginRight: '30px' }}>
            {auth.currentUser ?  auth.currentUser.displayName : 'не в сети'}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={() => {}} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={auth.currentUser ? auth.currentUser.photoURL : "/static/images/avatar/2.jpg"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar> 
    <Container style={{marginTop: '20px'}}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
        <Grid item xs={4}>
            <Box style={{height: '350px', borderRadius: '10px', boxShadow: '0px 0px 7px 5px rgba(0, 0, 0, 0.0294384)'}}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    users.map((user, index) => 
                        <ListItem alignItems="flex-start" key={index}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={user.photoURL ? user.photoURL : "/static/images/avatar/2.jpg"} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.displayName ? user.displayName : 'у девочки нет имени'}
                                style={{margin: 'auto 0', fontSize: '16px'}}
                                />
                        </ListItem>
                    )
                }
                </List>
            </Box>
        </Grid>

        <Grid item xs={8}>
            <Box style={{height: '350px', borderRadius: '10px', boxShadow: '0px 0px 7px 5px rgba(0, 0, 0, 0.0294384)'}}>
                <Container>
                
                    {flag 
                        ?
                            <div>
                                <Typography align='center' variant='h6'>{action} {word}</Typography>
                                <Input onChange= { e => setValue(e.target.value) }></Input>
                                <Button onClick={addWord}>Отправить</Button>
                            </div>
                        :
                            <Typography align='center' variant='h6'>{message}</Typography>

                        
                            //  send 
                            //     ?
                            //     <Typography align='center' variant='h6'>Отправка...</Typography>
                            //     :
                            //     <Typography align='center' variant='h6'>Отправлено</Typography>
                    }
    
                </Container>

            </Box>
        </Grid>
    </Grid>
        
        
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => console.log(users)} >room</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => joinRoom()} >записать</Button>
        {/* <Button variant='outlined' style={{marginTop: '10px'}} onClick={qq} >qq</Button> */}
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => console.log(users)}>logout</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => {}}>кноп очка</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => {}}>кноп 77</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => console.log(pos)}>позиция</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => console.log(flag)}>flag</Button>
        <Button variant='outlined' style={{margin: '10px'}} onClick={() => console.log(word)}>word</Button>
    </Container>
    <div>{word}</div>
    </div>
  );
};
export default RoomPage;
