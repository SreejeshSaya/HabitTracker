const tags = [
	'productivity',
	'coding',
	'reading',
	'earlyday',
	'mind',
	'exercise',
	'health',
	'finance',
	'soul',
	'family',
	'quit',
	'hobby',
	'sleep',
	'meditation',
	'socialmedia',
	'motivation'
]

const habits = {
    'study': [
        'Study for 2 hours'
    ],

	'productivity': [],
	
	'coding': [
        'Learn C++',
		'Learn Python',
		'Learn MEAN Stack',
		'Practise competitive coding',
		'Learn Algorithms'
    ],

	'reading': [
        'Read more novels',
		'Read atleast 1 book a week',
		'Read for 1 hour',
		'Read an article'
    ],

	'earlyday': [
        'Wake up before 6 AM',
    ],

	'mind': [
		'Take a nap between work',
    ],

	'exercise': [
        'Exercise for 15 mins',
        'Go to the gym for 45 mins',
		'Go for a run in the morning'
    ],

	'health': [
        'Practise yoga for atleast 10 mins',
    ],

	'finance': [
		'Save atleast Rs.100 everyday',
    ],

    'quit': [
        "Don't smoke",
		'Give up alcohol'
    ],

	'hobby': [
        'Practise violin',
		'Practise video editing skills'
    ],

	'sleep': [
        'Take a nap after lunch',
		'Sleep for atleast 8 hours'
    ],

    'meditation': [
        'Meditate for atleast 10 min',
		'Listen to a Sadhguru Podcast'
    ],

	'socialmedia': [
        'No YouTube',
		"Don't check Instagram",
		'Reddit less than 15 mins'
    ],

	'motivation': [
		'Read atleast 1 motivating quote'

    ]
}

const removeTime = (date) => {
    return new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
};
 
const daysDifference = (d1, d2) => {
return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};



module.exports = async function(){
    const Habit = context.services.get("Cluster0").db("habit_tracker").collection("habits");
    const lastDate = new Date(removeTime(new Date()) - 90 * 1000 * 60 * 60 * 24);
    const habits = await Habit.aggregate([
        {
            $match:{
                createdAt: {
                    $gte: lastDate,
                 },
                 tags:{
                     $elemMatch:{
                         $in: tags
                     }
                 }
            }
        },
        {
            $addFields:{
                hcount:{
                    $size:{
                        $ifNull:[
                            "$history",[]
                        ]
                    }
                }
            }
        },
        {
            $sort:{
                hcount:1
            }
        },
        {
            $limit:200
        }
    ]).toArray()

    let samples = {}
    tags.forEach(t=>samples[t]=[])
    habits.forEach(h=>{
        h.tags.forEach(t=>{
            if (tags.includes(t) && samples[t].length<10 && !samples[t].includes(h.text)){
                console.log(t,h.text)
                samples[t].push(h.text)
            }
        })
    })

    const Sample = context.services.get("Cluster0").db("habit_tracker").collection("samples");
    await Sample.updateOne({},{
        $set:{
            samples:samples
        }
    })
}

