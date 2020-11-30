const tags=  [
    'Excercise',
    'Coding',
    'Web Development',
    'C/C++',
    'Python',
    'Waking up',
    'Gym',
    'New hobby',
    'New game',
    'New sport',
    'Running',
    'New language'
]


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

