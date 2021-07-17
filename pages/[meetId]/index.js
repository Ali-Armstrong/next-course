import MeetupDetail from '../../components/meetups/MeetupDetails';
import {MongoClient, ObjectId} from 'mongodb';

function MeetupDetails(props){
    return <MeetupDetail {...props.meetUpData}/>;
}

/**
 * since this is a dynamic page, how can we generate all the possible details pages for all meetups
 * so this function we have to tell all the possible meetupIds so that it can fetch ang prerender for all pages
 * or else give fallback : true to dynamically generated for not specified meetIds 
 */
export async function getStaticPaths(){
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("nextjs-meetups");
    const meetupsCollection = db.collection("meetups");
    const meetups = await meetupsCollection.find({},{projection : {_id :1}}).toArray()
    client.close()
    return {
        //in reality we will fetch these from database
        fallback : false, //false means if anything request for not present ids it return 404
        paths : meetups.map(meet => ({
            params : {
                meetId : meet._id.toString()
            }
        }))
        
        // [
        //     {
        //         params : {
        //             meetId : "m1"
        //         }
        //     },
        //     {
        //         params : {
        //             meetId : "m2"
        //         }
        //     }
        // ]
    }
}

export async function getStaticProps(context){
    const meetId = context.params.meetId;
    console.log({meetId})
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("nextjs-meetups");
    const meetupsCollection = db.collection("meetups");
    const meetup = await meetupsCollection.findOne({_id : ObjectId(meetId)},{projection : {
        _id : 0}})
    //console.log(meetup)
    client.close()
    return {
        props : {
            meetUpData : meetup
        }
    }
}

export default MeetupDetails;