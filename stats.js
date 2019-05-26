module.exports=(app,firestore)=>{
    app.get('/stats', async (req, res) => {
      var consti=req.query.constituency;
     var constituency=consti;
     var cArray=new Array();
      console.log(consti);
      var candidate={};
      await firestore.collection("Election_Day").doc(consti).get().then(function(doc) {
          // check and do something with the data here.
          if (doc.exists) {
              console.log("Document data:", doc.data());
              var data=doc.data();
              candidate['Candidate_list']=data.Candidate_list;
              var Vcount=0;
              console.log("0 FROM HEX"+parseInt("1FFFFFFF",16));
              for(let  x in candidate['Candidate_list']){
                  console.log(x);
                Vcount=Vcount+(parseInt(candidate['Candidate_list'][x],16)-536870911);
                console.log(Vcount);
              }
              candidate['Vcount']=Vcount;
              candidate['Voters_registered']=data.Voters_registered;
              candidate['Voters_count']=data.Voters_count;
              candidate['constituency']=consti
              console.log(Vcount);
              console.log(candidate);
              var c=candidate;
              console.log(c);
              cArray.push(candidate);
          }

        });
    var partyCount=new Array();
    for(let  cand in candidate['Candidate_list']){
     // var cand=candidate['candidate_list'][i];
     console.log(cand);
     console.log(cand=="NOTA");
     var pmv={};
     if(cand=="NOTA"){
        pmv['party']="NOTA";
        pmv['count']=parseInt(candidate['Candidate_list'][cand],16)-536870911;
        partyCount.push(pmv);
        console.log(pmv);
     }
     else{
      await firestore.collection("Candidate").doc(cand).get().then(function(doc) {
        var data=doc.data();
        pmv['party']=data.party_name+"  ";
        pmv['count']=parseInt(candidate['Candidate_list'][cand],16)-536870911;
        partyCount.push(pmv);
        console.log(pmv);
      });
    }
    }
    console.log(cArray);
    console.log(constituency);
    //res.sendFile(__dirname+'/public/home.html');
    res.render('chart.hbs',{'candidates':cArray,'constituency':constituency,'partyCount':partyCount});
});
}