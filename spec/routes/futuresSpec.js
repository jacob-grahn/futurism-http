var sinon = require('sinon');
var futures = require('../../routes/futures');
var futureDict = require('../../shared/futures');


describe('routes/futures', function() {
    
    'use strict';

    
    describe('put', function() {
        
        
        var stats, req, res;
        
        beforeEach(function() {

            stats = {
                futures: [],
                fractures: 0,
            };
            stats.save = sinon.stub().yields(null, stats);

            req = {
                params: [],
                stats: stats
            };

            res = {
                apiOut: sinon.stub()
            };
        });
        
        
        it('should add future to your account if you have enough fractures', function() {
            stats.fractures = 1;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( stats.fractures ).toBe( 0 );
            expect( stats.futures ).toEqual( [futureDict.CAPITALISM] );
        });


        it('should subtract fractures from your account in ever increasing ammounts', function() {
            stats.fractures = 99;
    
            // first future costs 1
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( stats.fractures ).toBe( 98 );
            
            // second future costs 2
            req.params = {future: futureDict.RENAISSANCE};
            futures.put(req, res);
            expect( stats.fractures ).toBe( 96 );
            
            // third future costs 3
            req.params = {future: futureDict.EDEN};
            futures.put(req, res);
            expect( stats.fractures ).toBe( 93 );
        });


        it('should save changes to your account', function() {
            stats.fractures = 1;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( [null, stats] );
        });


        it('should reject request if you do not have enough fractures', function() {
            
            stats.fractures = 0;
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['1 more fracture(s) are needed to unlock this future'] );
            
            stats.fractures = 1;
            stats.futures = [futureDict.EDEN, futureDict.ANARCHY, futureDict.NUCLEAR_WAR];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[1] ).toEqual( ['3 more fracture(s) are needed to unlock this future'] );
            
            stats.fractures = -5;
            stats.futures = [];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[2] ).toEqual( ['6 more fracture(s) are needed to unlock this future'] );
        });


        it('should reject request if you already own the selected future', function() {
            stats.fractures = 999;
            stats.futures = [futureDict.CAPITALISM];
            req.params = {future: futureDict.CAPITALISM};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['You already own this future'] );
        });


        it('should reject request if you specify an invalid future', function() {
            stats.fractures = 999;
            req.params = {future: 123};
            futures.put(req, res);
            expect( res.apiOut.args[0] ).toEqual( ['Invalid future'] );
        });
        
    });

    
    
    
    
    describe('getList', function() {
        
        it("should return an array of a user's futures", function() {
            
            var stats = {
                futures: [futureDict.EDEN],
            };

            var req = {
                stats: stats
            };

            var res = {
                apiOut: sinon.stub()
            };
            
            futures.getList(req, res);
            
            expect( res.apiOut.args[0] ).toEqual( [null, [futureDict.EDEN]] );
            
        });
    });

});