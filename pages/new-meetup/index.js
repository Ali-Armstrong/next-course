import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';


function NewMeetup(){  
    const router = useRouter();

    async function newMeetupHandler(meetupData){
        console.log(meetupData)
        const response = await fetch('/api/new-meetup',{
            method : 'POST',
            body : JSON.stringify(meetupData),
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        console.log(response)
        router.push("/")
    }     
    
    return <NewMeetupForm onAddMeetup={newMeetupHandler}/>
}

export default NewMeetup;