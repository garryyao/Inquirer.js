/**
 * `file` type prompt
 */

var _ = require("lodash");
var util = require("util");
var clc = require("cli-color");
var Base = require("./base");
var Sep = require("../objects/separator");


/**
 * Module exports
 */

module.exports = Prompt;


/**
 * Constructor
 */

function Prompt() {
  Base.apply( this, arguments );
  return this;
}
util.inherits( Prompt, Base );


/**
 * Start the Inquiry session
 * @param  {Function} cb   Callback when prompt is done
 * @return {this}
 */

Prompt.prototype._run = function( cb ) {
  this.done = cb;

  // Init
  this.render();

  return this;
};


/**
 * Render the prompt to screen
 * @return {Prompt} self
 */

Prompt.prototype.render = function() {
  var file = this.opt.default;
  var message = this.getQuestion();
  if (file) message += clc.cyan( '(' + file + ')' );
  message += '\n(no change: enter)> ';
  this.write( message );

  var msgLines = message.split(/\n/);
  this.height = msgLines.length;
  this.rl.setPrompt( _.last(msgLines) );

  // Once user confirm (enter key)
  this.rl.once( "line", this.onSubmit.bind( this ) );

  return this;
};

Prompt.prototype.getQuestion = function () {
  return _.compose( this.prefix.bind(this), this.suffix.bind(this) )( this.opt.message );
};

/**
 * When user press "enter" key
 */

Prompt.prototype.onSubmit = function( file ) {
  file = file || this.opt.default;
  this.validate(file, function (isValid) {
    if ( isValid === true ) {
      this.status = "answered";
      this.clean( 1 ).render();
      this.rl.removeAllListeners( "line" );
      this.rl.write('\n');
      this.done( file );
    } else {
      this.error( isValid );
      this.rl.once( "line", function () {
        this.clean( 1 ).render();
      }.bind( this ) );
    }
  }.bind( this ));
};
