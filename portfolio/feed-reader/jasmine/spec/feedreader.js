/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */

$(function() {
    
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    
    describe('RSS Feeds', function() {
        
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        
        it('are defined', function() {
            expect(allFeeds).toBeDefined(); // allFeeds defined
            expect(allFeeds.length).not.toBe(0); // allFeeds not empty
        });

        /* test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        
        it('has a valid URL', function() {
            allFeeds.forEach(function(feed) {
                let valid_url = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(feed.url); // URL validation regex
                expect(feed.url).toBeDefined(); // URL is defined
                expect(feed.url.length).not.toBe(0); // URL has length
                expect(valid_url).toBe(true); // URL passes regex validation
            });

        });

        /* test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        
        it('has a valid name', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined(); // name is defined
                expect(feed.name.length).not.toBe(0); // name has length
            });

        });
    });

    describe('The menu', function() {
        
        /* test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        
        it('is initially hidden', function() {
            let hiddenStatus = $('body').hasClass("menu-hidden"); // class used to toggle menu
            expect(hiddenStatus).toBe(true);
        });
        
         /* test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        
        it('unfolds and folds again when clicked', function() {
            const clicks = [ 'open', 'close' ];
            for ( let click of clicks ) { // loop to test close and open behavior
                $(".menu-icon-link").click();
                let hiddenStatus = $('body').hasClass("menu-hidden");
                if ( click ===  'open' ) {
                    expect(hiddenStatus).toBe(false);
                }
                else {
                    expect(hiddenStatus).toBe(true);
                }
            }
        });
    });

    describe('Initial Entries', function() {
        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });
                    
        /* test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
            
        it("has at least 1 entry after loadFeed function is called", function(done) {
            let entries = $(".feed .entry").length; // enumerate feed entries
            expect(entries).toBeGreaterThan(0);
            done();
        });

    });

    describe('New Feed Selection', function() {
        var initialFeed;
        beforeEach(function(done) {
            loadFeed(0, function() {
                initialFeed = $(".feed").html(); // content of the initial feeds
                loadFeed(1, function() {
                    done();
                });
            });
        });
        
        /* test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        
        it("changes content correctly", function(done) {
            var newFeed = $(".feed").html(); // content of the newly selected feed
            expect(initialFeed).not.toBe(newFeed); // The content has been updated
            done();
        });
    });
}());
