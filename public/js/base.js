/*
----------------------------------------
----------------------------------------
Universal
----------------------------------------
---------------------------------------
*/

// Displays a popup message in the universal popup box
function flashMessage(message, type) {
    var dom = $("#primaryAlert");
    dom.removeClass("alert-success").removeClass("alert-info")
        .removeClass("alert-warning").removeClass("alert-danger");
    if (type == 0) {
        dom.addClass("alert-success");
    } else if (type == 1) {
        dom.addClass("alert-info");
    } else if (type == 2) {
        dom.addClass("alert-warning");
    } else {
        dom.addClass("alert-danger");
    }
    $("#primaryAlert").text(message).fadeIn(250).delay(message.length * 100).fadeOut(250);
}

// Shortcuts for displaying different types of popup messages
function flashSuccess(message) { flashMessage(message, 0); }
function flashInfo(message) { flashMessage(message, 1); }
function flashWarning(message) { flashMessage(message, 2); }
function flashError(message) { flashMessage(message, 3); }

// Sets up ajax requests to handle responses in a way that informs the user about what's going on
$(function () {
    $(document).ajaxSuccess(function (event, xhr, settings) {
        if (xhr.responseJSON) {
            if (xhr.responseJSON.redirect) {
                window.location.replace(window.location.origin + xhr.responseJSON.redirect);
            } else if (xhr.responseJSON.error) {
                flashError(xhr.responseJSON.error);
            } else if (xhr.responseJSON.warning) {
                flashWarning(xhr.responseJSON.warning);
            } else if (xhr.responseJSON.info) {
                flashInfo(xhr.responseJSON.info);
            } else if (xhr.responseJSON.success) {
                flashSuccess(xhr.responseJSON.success);
            }
        }
    });
    $(document).ajaxError(function (event, xhr, settings, thrownError) {
        if (xhr.responseJSON && xhr.responseJSON.message) {
            flashError(xhr.responseJSON.message);
        } else {
            flashError("Server error! Check the console for more info");
            console.log(xhr);
        }
    });
})