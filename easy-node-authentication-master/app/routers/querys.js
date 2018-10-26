module.exports = function(app, passport,models) {

    app.get('/querys/rp',isLoggedIn,(req,res)=>{
        // res.send("vao rq");
        res.render('query/rp.ejs',{
            menuId:'report',
            loi:"",
            datas: null
        });
    });

    app.get('/querys/rp/pkgname',isLoggedIn,(req,res)=>{
        // res.send("vao rq pkg");
        var query = models.User.find({});
        query.sort({pkgname:-1});

        query.exec(function(err,data){
            if(err){
                console.log("query loi" + err);
                res.render('query/rpPkg.ejs',{
                    menuId:'report Pkg',
                    loi: "query",
                    listPkg: null,
                    datas : null,
                    namePkg: null
                });
            } else {
                var listPkg = [];

                var listPkg = getListPkg(data);
                // console.log("list: " + listPkg.length);

                res.render('query/rpPkg.ejs',{
                    menuId:'report Pkg',
                    loi:"",
                    listPkg: listPkg,
                    datas : null,
                    namePkg:null
                });
            }
        });
    })

    app.get('/querys/rpdaily',isLoggedIn,(req,res)=>{
        res.send("vao rpdaily");
        // res.render('query/rp.ejs',{
        //     menuId:'report',
        //     loi:"",
        //     datas: null
        // });
    })

    app.get('/querys/rpoption',isLoggedIn,(req,res)=>{
        res.send("vao rpoption");
        // res.render('query/rp.ejs',{
        //     menuId:'report',
        //     loi:"",
        //     datas: null
        // });
    })



    app.post('/querys/rp',isLoggedIn,(req,res)=>{
        console.log(req.body);
        // res.setHeader('Content-Type', 'application/json');

        if(req.body.dateEnd < req.body.dateFrom)
        {
            res.render('query/rp.ejs',{
                menuId:'report',
                loi:"date",
                datas: null
            });
        } else {
            var dateStart = new Date('1000-1-1');
            var dateEnd = new Date();

            if(req.body.dateFrom != ''){
                // dateStart = req.body.dateFrom;
                dateStart = new Date(req.body.dateFrom);
                dateStart.setHours(0);
                dateStart.setMinutes(0);
                dateStart.setSeconds(0);
            }

            if(req.body.dateEnd != ''){
                // dateEnd = req.body.dateEnd;
                dateEnd = new Date(req.body.dateEnd);
                dateEnd.setHours(23);
                dateEnd.setMinutes(60);
                dateEnd.setSeconds(60);
            }
            console.log(dateStart + " va " + dateEnd);

            var query = models.User.find({
                        "date":{
                            $gte: dateStart,
                            $lte: dateEnd
                        }
            });
            query.sort({pkgname:-1});

            query.exec(function(err,data){
                if(err){
                    console.log("query loi" + err);
                    res.render('query/rp.ejs',{
                        menuId:'report',
                        loi: "query",
                        datas: null
                    });
                } else {
                    var dulieu= [];

                    dulieu = getRpData(data);
                    // data.forEach(function(datas){
                    //     dulieu.push(datas);
                    // })
                    if(dulieu.length > 0)
                        console.log("dulieu: " + dulieu[0].name);

                    res.render('query/rp.ejs',{
                        menuId:'report',
                        loi: "",
                        datas: dulieu
                    });
                }
            });
        }
    });


    app.post('/querys/rp/pkgname',(req,res)=>{
        console.log("body: " + JSON.stringify(req.body));

        var query = models.User.find({});

        var listPkg = [];

        query.sort({pkgname:-1});

        query.exec(function(err,data){
            if(err){
                console.log("query loi" + err);
                res.render('query/rpPkg.ejs',{
                    menuId:'report Pkg',
                    loi: "query",
                    listPkg: null,
                    datas : null,
                    namePkg: null
                });
            } else {
                listPkg = getListPkg(data);
                console.log("list: " + listPkg);

                if(req.body.dateEnd < req.body.dateFrom)
                {
                    res.render('query/rpPkg.ejs',{
                        menuId:'report Pkg',
                            loi:"date",
                            listPkg: listPkg,
                            datas : null,
                            namePkg:null
                    });
                } else {
                    var dateStart = new Date('1000-1-1');
                    var dateEnd = new Date();

                    if(req.body.dateFrom != ''){
                        // dateStart = req.body.dateFrom;
                        dateStart = new Date(req.body.dateFrom);
                        dateStart.setHours(0);
                        dateStart.setMinutes(0);
                        dateStart.setSeconds(0);
                    }

                    if(req.body.dateEnd != ''){
                        // dateEnd = req.body.dateEnd;
                        dateEnd = new Date(req.body.dateEnd);
                        dateEnd.setHours(23);
                        dateEnd.setMinutes(60);
                        dateEnd.setSeconds(60);
                    }
                    console.log(dateStart + " va " + dateEnd);
                    console.log("list 3: " + listPkg);

                    var query1 = models.User.find({
                                "date":{
                                    $gte: dateStart,
                                    $lte: dateEnd
                                },
                                "pkgname":req.body.pkg
                            });

                    query1.sort({pkgname:-1});

                    query1.exec(function(err,data){
                        if(err){
                            console.log("query loi" + err);
                            res.render('query/rpPkg.ejs',{
                                menuId:'report Pkg',
                                loi:"query",
                                listPkg: listPkg,
                                datas : null,
                                namePkg:null
                            });
                        } else {
                            var dulieu= [];

                            dulieu = getRpByDay(data);

                            if(dulieu.length > 0)
                                console.log("dulieu: " + dulieu[0].date);

                            res.render('query/rpPkg.ejs',{
                                menuId:'report Pkg',
                                loi:"",
                                listPkg: listPkg,
                                datas : dulieu,
                                namePkg:req.body.pkg
                            });
                        }
                    });
                    
                }
            }
        });
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function kiemtra(name,arr){

    if(arr.length == 0)
        return 0;

    for(var i=0; i < arr.length; i++){
        if(name == arr[i].name)
            return i;
    }

    return arr.length;
}

function kiemtradate(date,arr){

    if(arr.length == 0)
        return 0;

    for(var i=0; i < arr.length; i++){
        if(date == arr[i].date)
            return i;
    }

    return arr.length;
}


function getRpByDay(userData) {

	var data = {};
    var counts = {};
    
    var arr=[];
    var iarr=0;

	for (var i = 0; i < userData.length; i++) {

		data[userData[i].pkgname] = data[userData[i].pkgname] || {};


		var dateUser = userData[i].date.getDate() + "-" + (1 + userData[i].date.getMonth()) + "-" + userData[i].date.getFullYear();
        data[userData[i].pkgname][dateUser] = data[userData[i].pkgname][dateUser] || {};
        
        var tg = {};

        var tg = {};
        var itg = kiemtradate(dateUser,arr);

        tg.date = dateUser;

        if(itg == iarr){
            iarr++;
            tg.active = 0;
            tg.install = 0;
            tg.installdevice = 0;
            arr.push(tg);
        }

		if (userData[i].install == 1) {
            arr[itg].install++;

			data[userData[i].pkgname][dateUser].install = 1 + (data[userData[i].pkgname][dateUser].install || 0);

			//    // Check trên 1 ngày device có lặp lại ko
			//    counts[userData[i].pkgname] = counts[userData[i].pkgname] || {};
			//    counts[userData[i].pkgname][dateUser] = counts[userData[i].pkgname][dateUser] || {};

			// counts[userData[i].pkgname][dateUser][userData[i].did] = 1 + (counts[userData[i].pkgname][dateUser][userData[i].did] || 0);
			//    if(counts[userData[i].pkgname][dateUser][userData[i].did] == 1)
			//    	data[userData[i].pkgname][dateUser].installDevice = 1 + (data[userData[i].pkgname][dateUser].installDevice || 0);


			// Check lifetime device đó có lặp lại install ko
			counts[userData[i].pkgname] = counts[userData[i].pkgname] || {};
			counts[userData[i].pkgname][dateUser] = counts[userData[i].pkgname][dateUser] || {};

			counts[userData[i].pkgname][userData[i].did] = 1 + (counts[userData[i].pkgname][userData[i].did] || 0);
			if (counts[userData[i].pkgname][userData[i].did] == 1){
                data[userData[i].pkgname][dateUser].installDevice = 1 + (data[userData[i].pkgname][dateUser].installDevice || 0);
                arr[itg].installdevice++;
            }
		}

		if (userData[i].install == 0){
            data[userData[i].pkgname][dateUser].active = 1 + (data[userData[i].pkgname][dateUser].active || 0);
            arr[itg].active++;
        }
    }
    
	return arr;
}

function getListPkg(userData){
    console.log("length data = " + userData.length);

    var arr = [];
    var iarr = 0;

    for (var i = 0; i < userData.length; i++) {
        var check = 0;
        for(var j=0; j<arr.length; j++){
            if(arr[j] == userData[i].pkgname){
                check = 1;
                break;
            }
        }

        if(check == 0){
            arr[iarr] = userData[i].pkgname;
            iarr++;
        }
    }
    return arr;
}

function getRpData(userData) {
	console.log("length data = " + userData.length);
	var data = {};
    var counts = {};
    var arr = [];
    var iarr = 0;

	for (var i = 0; i < userData.length; i++) {
        data[userData[i].pkgname] = data[userData[i].pkgname] || {};
        var tg = {};
        var itg = kiemtra(userData[i].pkgname,arr);
        // arr[itg].name = userData[i].pkgname;
        tg.name = userData[i].pkgname;

        if(itg == iarr){
            iarr++;
            tg.active = 0;
            tg.install = 0;
            tg.installdevice = 0;
            arr.push(tg);
        }

		if (userData[i].install == 1) {
            arr[itg].install++;

			data[userData[i].pkgname].install = 1 + (data[userData[i].pkgname].install || 0);
			// Check lịch sử device đó có lặp lại ko
			counts[userData[i].pkgname] = counts[userData[i].pkgname] || {};

			counts[userData[i].pkgname][userData[i].did] = 1 + (counts[userData[i].pkgname][userData[i].did] || 0);

			if (counts[userData[i].pkgname][userData[i].did] == 1){ // lần đầu xuất hiện
                data[userData[i].pkgname].installDevice = 1 + (data[userData[i].pkgname].installDevice || 0);
                arr[itg].installdevice++;
            }
		}
		if (userData[i].install == 0){
            data[userData[i].pkgname].active = 1 + (data[userData[i].pkgname].active || 0);
            arr[itg].active++;
        }
    }

	return arr;
}