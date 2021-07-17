import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

const Dummy_Meetups = [
    {
        id : "m1",
        title : "First Meetup",
        image : "https://thumbs.dreamstime.com/z/diversity-group-people-meet-up-party-concept-conference-meeting-business-vector-illustration-communication-working-150221450.jpg",
        address : "no , some city, some pin",
        description : "Some Random Description"
    },
    {
        id : "m2",
        title : "Second Meetup",
        image : "https://www.elegantthemes.com/blog/wp-content/uploads/2021/01/how-to-host-a-meetup-featured-image.jpg",
        address : "no , some city, some pin",
        description : "Some Random Description"
    }
]

function HomePage(props){
    /**
     * Problem 1, with the below approach , the data in initial pre rendered cycle is empty
     * and the data fetch operation happens on client side(typical SPA style), and SEO only consider initial cycle page response
     * so it is not so good for SEO
     */
    // const [loadedMeetups, setLoadedMeetups] = useState([]);

    // useEffect(()=>{
    //     //assume that you do a http request and get the data here
    //     setLoadedMeetups(Dummy_Meetups)
    // },[]);

    return<MeetupList meetups={props.meetups}/>
}

/**
 * getStaticProps() is a reserved key word in next which execute before pre rendering to get
 * data and include data while pre rendering the page to avoid above problem
 */
export async function getStaticProps(){
    /**
     * We could write an api and fetch the data here, but instead of that, since it is static Props function
     * we can write the fetching records code directly here, since it is gonna run on server only
     * and all the code and npm packages used inside getStaticProps won't be part of client side bundle
     */
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("nextjs-meetups");
    const meetupsCollection = db.collection("meetups");
    const meetups = await meetupsCollection.find().toArray();
    client.close()
    return {
        props : {
            meetups : meetups.map(meet=>({
                title : meet.title,
                address : meet.address,
                image : meet.image,
                id : meet._id.toString()
            })) //response from request
        },
        revalidate : 10 //the page automatically pre rendered with new data for every 10 seconds if page is still requested by users
    }
}


/**
 * sometimes the above is not enought, we want to load new data for each single request 
 * then we can go with below, this function executes always on the server side for each single request
 */
// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;
//     return{
//         props : {
//             meetups : Dummy_Meetups
//         }
//     }
// }

export default HomePage;