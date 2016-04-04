/*
 * ssdForm jQuery plugin
 * Examples and documentation at: https://github.com/sebastiansulinski/ssd-form
 * Copyright (c) 2016 Sebastian Sulinski
 * Version: 1.0.0 (02-APR-2016)
 * Licensed under the MIT.
 * Requires: jQuery v1.9 or later
 */
;(function(window, $, undefined) {

    "use strict";

    $.fn.ssdForm = function (options) {

        "use strict";

        var settings = $.extend({

                dataFormWrapper: 'data-form-wrapper',
                dataConfirmation: 'data-confirmation',
                dataValidationSegment: 'data-validation',
                dataValidationCase: 'data-case',
                dataSubmitTrigger: 'data-submit-trigger',
                dataSubmitPending: 'data-submit-pending',

                classHide: 'hide',
                classShow: 'show',

                extendBehaviours: {},
                extendValidationRules: {}

            }, options),
            formWrapper = '[' + settings.dataFormWrapper + ']',
            formConfirmation = '[' + settings.dataConfirmation + ']',
            formValidationSegment = '[' + settings.dataValidationSegment + ']',
            formValidationCase = '[' + settings.dataValidationCase + ']',
            formSubmitTrigger = '[' + settings.dataSubmitTrigger + ']',
            formSubmitPending = '[' + settings.dataSubmitPending + ']';

        var ErrorCollection = function() {

            "use strict";

            var errors = {};

            this.add = function(key, index) {

                "use strict";

                if (errors.hasOwnProperty(key)) {
                    return false;
                }

                errors[key] = index;

            };

            this.all = function() {

                "use strict";

                return errors;

            };

            this.empty = function() {

                return Object.keys(errors).length === 0;

            };

        };

        var Document = {

            replace: function(data) {

                "use strict";

                if (data.replace === undefined) {
                    return;
                }

                $.each(data.replace, function(key, value) {

                    $('[data-' + key + ']').html(value);

                });

            },

            remove: function(data) {

                "use strict";

                if (data.remove === undefined) {
                    return;
                }

                $.each(data.remove, function(key, value) {

                    $('[data-' + value + ']').remove();

                });

            },

            reload: function() {

                "use strict";

                window.location.reload(true);

            },

            redirect: function(url) {

                "use strict";

                window.location.href = url;

            }

        };

        var ValidatorRule = $.extend({

            elements: [],

            required: function(element) {

                "use strict";

                return ( ! (
                    element.value === '' ||
                    element.value === null ||
                    element.value === undefined
                ));

            },

            checked: function(element) {

                "use strict";

                return element.isChecked;

            },

            value_is: function(element) {

                "use strict";

                return element.value == element.rules_collection;

            },

            email: function(element) {

                "use strict";

                var pattern = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+([.\-]?[a-zA-Z0-9]+)?([\.]{1}[a-zA-Z]{2,4}){1,4}$/;

                return pattern.test(element.value);

            },

            password: function(element) {

                "use strict";

                var pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
                return pattern.test(element.value);
            },

            min: function(element) {

                "use strict";

                return element.value.length >= element.rules_collection;

            },

            max: function(element) {

                "use strict";

                return element.value.length <= element.rules_collection;

            },

            confirmed: function(element) {

                "use strict";

                var confirmation_field = element.name + '_confirmation',
                    confirmation = this.elements.filter(function (i, v) {
                        return v.name === confirmation_field;
                    })[0];

                if (confirmation.length === 0) {

                    throw new Error(element.name + '_confirmation' + ' field is missing');

                }

                return confirmation.value === element.value;

            },

            test: function(elements, element) {

                "use strict";

                var self = this,
                    deferred = $.Deferred();

                self.elements = elements;

                $.each(element.rules, function(i, v) {

                    var split = v.split(':'),
                        rule = split.shift();

                    element.rules_collection = split;

                    if ( ! self[rule](element)) {
                        deferred.reject(rule);
                    }

                    if ( (i + 1) == element.rules.length ) {
                        deferred.resolve();
                    }

                });

                return deferred.promise();

            }

        }, settings.extendValidationRules);

        var Validator = function(form, error) {

            "use strict";

            var ignoreElements = ".button, [disabled]";

            if ( ! (form instanceof FormModel) ) {

                throw new Error('Invalid argument form.');

            }

            if ( ! (error instanceof ErrorCollection) ) {

                throw new Error('Invalid argument error.');

            }

            function shouldInclude(element) {

                "use strict";

                return (
                    element.isVisible ||
                    element.isEditor
                );

            }

            function validate(elements, element) {

                "use strict";

                if ( ( $.inArray('required', element.rules) === -1 ) && element.value == '') {
                    return true;
                }

                return ValidatorRule.test(elements, element);

            }

            function end(i, length, deferred) {

                "use strict";

                if ( (i + 1) === length ) {

                    if (error.empty()) {

                        deferred.resolve();

                    } else {

                        deferred.reject(error.all());

                    }

                }

            }

            this.run = function() {

                "use strict";

                var elements = form.instance().find(':input').not(ignoreElements),
                    length = elements.length,
                    deferred = $.Deferred();

                $.each(elements, function(i, v) {

                    var obj = $(this),
                        element = {
                            instance: obj,
                            name: obj.prop('name'),
                            type: obj.prop('type'),
                            value: obj.prop('value'),
                            rules: obj.data('validate'),
                            isChecked: obj.is(':checked'),
                            isVisible: obj.is(':visible'),
                            isEditor: obj.hasClass('editor')
                        };

                    if ( ! shouldInclude(element)) {
                        end(i, length, deferred);
                        return true;
                    }

                    if ( element.rules === undefined || element.rules.length === 0 ) {
                        end(i, length, deferred);
                        return true;
                    } else {
                        element.rules = element.rules.split('|');
                    }

                    $.when(validate(elements, element))
                        .done(function() {
                            end(i, length, deferred);
                        })
                        .fail(function(rule) {
                            error.add(element.name, rule);
                            end(i, length, deferred);
                        });

                });

                return deferred.promise();

            }

        };

        var FormBehaviour = $.extend({

            redirect: function(form, data) {

                "use strict";

                if ( ! data.redirect ) {
                    throw new Error('Redirect entry missing.');
                }

                Document.redirect(data.redirect);

            },

            reload: function() {

                "use strict";

                Document.reload();

            },

            fadeOutShowMessage: function(form, data) {

                "use strict";

                Form.endRequest(form);

                var formWrapper = form.instance().closest(formWrapper),
                    messageWrapper = formWrapper.find(formConfirmation);

                form.instance().fadeOut(200, function() {

                    messageWrapper.html(data.message).fadeIn(200);

                });


            },

            fadeOutShowMessageRedirect: function(form, data) {

                "use strict";

                Form.endRequest(form);

                var formWrapper = form.instance().closest(formWrapper),
                    messageWrapper = formWrapper.find(formConfirmation);

                form.instance().fadeOut(200, function() {

                    messageWrapper.html(data.message).fadeIn(200, function() {

                        setTimeout(function() {


                            window.location.href = data.redirect;

                        }, 3000);

                    });

                });


            },

            fadeOutShowMessageResetFadeIn: function(form, data) {

                "use strict";

                Form.endRequest(form);

                var formWrapper = form.instance().closest(formWrapper),
                    messageWrapper = formWrapper.find(formConfirmation);

                form.instance().fadeOut(200, function() {

                    messageWrapper.html(data.message).fadeIn(200);

                    setTimeout(function() {

                        messageWrapper.fadeOut(200, function() {

                            form.instance()[0].reset();
                            form.instance().fadeIn(200);

                        });

                    }, 3000);

                });

            },

            callReplaceRemove: function(form, data) {

                "use strict";

                Document.replace(data);
                Document.remove(data);

            },

            ask: function(form, data) {

                "use strict";

                if ( ! this.hasOwnProperty(data.behaviour)) {
                    throw new Error('Behaviour not specified.');
                }

                this[data.behaviour](form, data);

            },

            run: function(form, data) {

                "use strict";

                var behaviour = form.successBehaviour();

                if ( ! this.hasOwnProperty(behaviour)) {
                    throw new Error('Behaviour does not exist.');
                }

                this[behaviour](form, data);

            }

        }, settings.extendBehaviours);



        var FormModel = function(form) {

            "use strict";

            var options = {
                    method : form.prop('method'),
                    action : form.prop('action'),
                    successBehaviour : form.data('success-behaviour'),
                    data : form.serializeArray()
                },
                validator,
                error;

            function validateOptions() {

                "use strict";

                if (options.method === undefined) {

                    options.method = 'post';

                }

                if (options.action === undefined) {

                    throw new Error('No action defined.');

                }

            }

            validateOptions();

            this.instance = function() {

                "use strict";

                return form;

            };

            this.method = function() {

                "use strict";

                return options.method;

            };

            this.action = function() {

                "use strict";

                return options.action;

            };

            this.successBehaviour = function() {

                "use strict";

                return options.successBehaviour;

            };

            this.data = function() {

                "use strict";

                return options.data;

            };

            this.validate = function() {

                "use strict";

                error = new ErrorCollection();
                validator = new Validator(this, error);

                return validator.run();

            };

            this.reset = function() {

                "use strict";

                form.trigger('reset');

            }

        };

        var Form = {

            clearErrors: function(form) {

                "use strict";

                form.instance().find(
                    formValidationSegment + ' ' + formValidationCase
                ).removeClass(settings.classShow);

            },

            displayAlert: function(content) {

                "use strict";

                // TODO - to implement

            },

            displayErrors: function(form, errors) {

                "use strict";

                var index;

                for (var key in errors) {

                    if (errors.hasOwnProperty(key)) {

                        if (key == 'alert') {

                            this.displayAlert(errors[key]);

                            continue;

                        }

                        index = $.isArray(errors[key]) ? errors[key][0] : errors[key];

                        form
                            .instance()
                            .find(
                                '[' + settings.dataValidationSegment + '="' + key + '"] ' +
                                '[' + settings.dataValidationCase + '="' + index + '"]'
                            )
                            .addClass(settings.classShow);

                    }

                }

            },

            beginRequest: function(form) {

                "use strict";

                if (form.instance().data('quiet')) {
                    return true;
                }

                form.instance().find(formSubmitTrigger).addClass(settings.classHide);
                form.instance().find(formSubmitPending).removeClass(settings.classHide);

            },

            endRequest: function(form) {

                "use strict";

                if (form.instance().data('quiet')) {
                    return true;
                }

                form.instance().find(formSubmitTrigger).removeClass(settings.classHide);
                form.instance().find(formSubmitPending).addClass(settings.classHide);

            },

            successBehaviour: function(form, data) {

                "use strict";

                FormBehaviour.run(form, data);

            },

            disableForm: function(form) {

                "use strict";

                this.submitted = form;

            },

            enableForm: function() {

                "use strict";

                this.submitted = null;

            },

            endRequestDisplayErrors: function(form, errors) {

                "use strict";

                this.endRequest(form);
                this.displayErrors(form, errors);

            },

            endRequestDisplayErrorsReset: function(form, errors) {

                "use strict";

                this.endRequestDisplayErrors(form, errors);
                form.reset();

            },

            formAction: function(form, success, error, fail) {

                "use strict";

                var self = this;

                $.when(form.validate())
                    .done(function(data, textStatus, jqXHR) {

                        self.beginRequest(form);

                        $.ajax({
                            method: form.method(),
                            url: form.action(),
                            data: form.data(),
                            dataType: 'json',
                            cache: false,
                            success: success,
                            error: error
                        });

                    })
                    .fail(fail);

            },

            submit: function(instance) {

                "use strict";

                var self = this;

                $(instance).on('submit', function(event) {

                    event.preventDefault();

                    var form = new FormModel($(this));

                    self.clearErrors(form);

                    self.formAction(
                        form,
                        function(data) {

                            self.successBehaviour(form, data);

                        },
                        function(jqXHR, textStatus, errorThrown) {

                            self.endRequestDisplayErrors(form, jqXHR.responseJSON);

                        },
                        function(errors) {

                            self.endRequestDisplayErrors(form, errors);

                        }
                    );

                });

            },

            clickSubmit: function() {

                "use strict";

                $(document).on('click', '.clickSubmit', function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    var target = $(this).data('target');

                    $(target).submit();

                });

            },

            init: function(instance) {

                "use strict";

                this.submit(instance);
                this.clickSubmit();

            }

        };

        return Form.init(this);
    };

})(window, window.jQuery);