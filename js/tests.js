/*jshint esversion: 8*/
/*jshint mocha: true */


suite("Tests", () => {

    test("transformeDate", () => {
        chai.assert.equal("jamais", transformeDate(false).toLowerCase());
        chai.assert.equal("31/03/2019 - 16:54", transformeDate("2019-03-31T14:54:13.808Z").toLowerCase());
    });


    test("compareDate", () => {
        chai.assert.equal("1", compareDate("2019-03-31T14:54:13.808Z", "2019-04-31T14:54:13.808Z").toString());
        chai.assert.equal("-1", compareDate("2019-04-31T14:54:13.808Z", "2019-03-31T14:54:13.808Z").toString());
        chai.assert.equal("-1", compareDate("2019-04-31T14:54:13.808Z", "2019-04-31T14:55:13.808Z").toString());
    });


    test("whoami", () => {
        let s = new State();
        s.x_api_key = "dbe5d1c1-4630-57d1-bf6a-dbd746c58565";        
        whoami(s).then((data) => {
            chai.assert.equal("11615530", data.login);
        });
    });


    test("dernière activité", () => {
        const contribs = [{"likers":["timothee.pecatte@ens-lyon.fr"],"dislikers":["timothee.pecatte@ens-lyon.fr","xavier.urbain@univ-lyon1.fr"],"date":"2019-03-31T14:54:16.544Z","_id":"5ca0d49865461e048d66df4f","content":"test post #313 (simulating user test)","user":"test"},{"likers":["antoine.bulliffon@gmail.com","test"],"dislikers":["antoine.bulliffon@gmail.com","xavier.urbain@univ-lyon1.fr","test"],"date":"2019-03-31T14:54:58.994Z","_id":"5ca0d4c265461e048d66df50","content":"test post #666 (simulating user timothee.pecatte@ens-lyon.fr)","user":"timothee.pecatte@ens-lyon.fr"}];
        chai.assert.equal("2019-03-31T14:54:58.994Z", recupDateDerniereActivite(contribs));
    });


    test("tri des contributions par nombre de likes", () => {
        const contribs = [{"likers":["timothee.pecatte@ens-lyon.fr"],"dislikers":["timothee.pecatte@ens-lyon.fr","xavier.urbain@univ-lyon1.fr"],"date":"2019-03-31T14:54:16.544Z","_id":"5ca0d49865461e048d66df4f","content":"test post #313 (simulating user test)","user":"test"},{"likers":["antoine.bulliffon@gmail.com","test"],"dislikers":["antoine.bulliffon@gmail.com","xavier.urbain@univ-lyon1.fr","test"],"date":"2019-03-31T14:54:58.994Z","_id":"5ca0d4c265461e048d66df50","content":"test post #666 (simulating user timothee.pecatte@ens-lyon.fr)","user":"timothee.pecatte@ens-lyon.fr"}];

        let s = new State();
        s.currentTopicID = 0;
        s.sortContrib = "likers";
        s.sortContribOrder = "desc";
        s.topics = [{contributions:[]}];
        s.topics[0].contributions = contribs;
        triContribs(s);
        chai.assert.equal("5ca0d49865461e048d66df4f", s.topics[0].contributions[0]._id);
    });


    test("tri des contributions par date", () => {
        const contribs = [{"likers":["timothee.pecatte@ens-lyon.fr"],"dislikers":["timothee.pecatte@ens-lyon.fr","xavier.urbain@univ-lyon1.fr"],"date":"2019-03-31T14:54:16.544Z","_id":"5ca0d49865461e048d66df4f","content":"test post #313 (simulating user test)","user":"test"},{"likers":["antoine.bulliffon@gmail.com","test"],"dislikers":["antoine.bulliffon@gmail.com","xavier.urbain@univ-lyon1.fr","test"],"date":"2019-03-31T14:54:58.994Z","_id":"5ca0d4c265461e048d66df50","content":"test post #666 (simulating user timothee.pecatte@ens-lyon.fr)","user":"timothee.pecatte@ens-lyon.fr"}];

        let s = new State();
        s.currentTopicID = 0;
        s.sortContrib = "date";
        s.sortContribOrder = "desc";
        s.topics = [{contributions:[]}];
        s.topics[0].contributions = contribs;
        triContribs(s);

        chai.assert.equal("5ca0d4c265461e048d66df50", s.topics[0].contributions[0]._id);
    });




});