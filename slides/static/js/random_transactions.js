var data_base = {
    'Credit Card':[
        {
            name:'Gas Station Fillup at *',
            min:10,
            max:60,
            tokens:['76', 'Exxon', 'Costco'],
            min_freq:2,
            max_freq:6
        },

        {
            name:'Restaurant Bill at *',
            min:5,
            max:30,
            tokens:['Taco Bell', 'Pizza My Heart', 'Shinobi', 'Olive Garden'],
            min_freq:5,
            max_freq:20
        },

        {
            name:'Retail purchase at *',
            tokens:['Nordstorm', 'Ross', 'IKEA', 'Walgreens'],
            min:20,
            max:400,
            min_freq:3,
            max_freq:6
        },

        {
            name:'ATM Cash at *',
            tokens:['Bank of America', 'Wells Fargo'],
            min:20,
            max:300,
            inc:20,
            min_feq:6,
            max_freq:12
        }
    ],

    'Bill':[
        {
            name:'Car Payment to Acura',
            min:350,
            max:350,
            min_freq:1,
            max_freq:1
        },

        {
            name:'Verizon',
            min:150,
            max:250,
            min_freq:1,
            max_freq:1
        },

        {
            name:'Rent',
            min:1200,
            max:1200,
            min_freq:1,
            max_freq:1
        }

    ],

    'Misc':[
        {
            name:'DMV Parking Ticket',
            min:25,
            max:100,
            min_freq:0,
            max_freq:2,
            inc:25
        },
        {
            name:'Therapy session with *',
            tokens:['Bob', 'Sue', 'Rufus'],
            min_freq:0,
            max_freq:3,
            min: 50,
            max: 200
        },
        {
            name:'Concert Tickets For *',
            tokens:['The Who', 'Blue Man Group', 'Puppetry of the Ear', 'The Lion King'],
            min_freq:0,
            max_freq:3,
            min: 20,
            max: 150
        }
    ]

}

function random_transactions(bs, be) {
    var id = 1;

    var time = new Date(bs.getTime());

    var items = [];

    while (time.getTime() < be.getTime()) {
        var next_month = new Date(time.getTime());
        next_month.setMonth(time.getMonth() + 1);
        var time_span = next_month.getTime() - time.getTime();
      //  console.log('time = ', time);
        _.each(data_base, function (ci, type) {
        //    console.log('making ', type, ci);
            _.each(ci, function (c) {
                if (!c.max_freq){
                    c.max_freq = c.min_freq = 1;
                }
                var range = (c.max_freq - c.min_freq);
                var freq = Math.round(Math.random() * range + c.min_freq)
          //      console.log('freq ', freq, range);
                while (freq) {
                    var occurs = Math.floor(time_span * Math.random()) + time.getTime();
                    if (c.tokens) {
                        var name = c.name.replace('*', _.shuffle(c.tokens)[0])
                    } else {
                        var name = c.name;
                    }

                    var amount = (Math.random() * (c.max - c.min)) + c.min;
                    if (c.inc) {
                        amount -= (amount % c.inc);
                    }

                    var ni = {
                        id: id++,
                        name:name,
                        amount:amount.toFixed(2),
                        type:type,
                        date: occurs
                    };

                //    console.log('item: ', ni);

                    items.push(ni);

                    --freq;
                }

            })
        })
        time = next_month;
    }
    return items;
}