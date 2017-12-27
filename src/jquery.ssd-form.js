/*
 * ssdForm jQuery plugin
 * Examples and documentation at: https://github.com/sebastiansulinski/ssd-form
 * Copyright (c) 2017 Sebastian Sulinski
 * Version: 1.5.5 (27-DEC-2017)
 * Licensed under the MIT.
 * Requires: jQuery v1.9 or later
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) {
            return (factory(a0));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        factory(root["jQuery"]);
    }
}(this, function ($) {

    (function() {

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

                    classCkEditor: 'editor',
                    classHide: 'hide',

                    classShow: 'show',
                    extendBehaviours: {},

                    extendValidationRules: {},

                    postAjaxSuccess: function(form, form_model, data) {
                        form.successBehaviour(form_model, data);
                    },
                    postAjaxFailure: function(form, form_model, jqXHR, textStatus, errorThrown) {
                        form.endRequestDisplayErrors(form_model, jqXHR.responseJSON);
                    },

                    ignoreElements: '.button, [disabled]',

                    serializeAttribute: 'name',

                    actionMethod: function(form, form_model, success, error) {

                        $.ajax({
                            method: form_model.method(),
                            url: form_model.action(),
                            data: form_model.data(),
                            dataType: 'json',
                            cache: false,
                            success: success,
                            error: error
                        });

                    }

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

                radio: function(element) {

                    "use strict";

                    return this.checked(element);
                },

                value_is: function(element) {

                    "use strict";

                    return element.value === element.rules_collection[0];

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

                    return element.value.length >= element.rules_collection[0];

                },

                max: function(element) {

                    "use strict";

                    return element.value.length <= element.rules_collection[0];

                },

                confirmed: function(element) {

                    "use strict";

                    var confirmation_field = element.name + '_confirmation',
                        confirmation = this.elements.filter(function (el) {
                            return el.name === confirmation_field;
                        })[0];

                    if (!confirmation) {

                        throw new Error(element.name + '_confirmation' + ' field is missing');

                    }

                    return confirmation.value === element.value;

                },

                regex: function(element) {

                    "use strict";

                    var regex = new RegExp(element.regex);

                    return regex.test(element.value);

                },

                test: function(elements, element) {

                    "use strict";

                    var $this = this,
                        deferred = $.Deferred();

                    $this.elements = elements;

                    $.each(element.rules, function(index, rules) {

                        var split = rules.split(':'),
                            rule = split.shift();

                        element.rules_collection = split;

                        if ( ! $this[rule](element)) {
                            deferred.reject(rule);
                        }

                        if ( (index + 1) === element.rules.length ) {
                            deferred.resolve();
                        }

                    });

                    return deferred.promise();

                }

            }, settings.extendValidationRules);

            var Validator = function(form_model, error) {

                "use strict";

                if ( ! (form_model instanceof FormModel) ) {

                    throw new Error('Invalid argument form_model.');

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

                    if ( ( $.inArray('required', element.rules) === -1 ) && element.value === '') {
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

                    var elements = form_model.inputs(),
                        length = elements.length,
                        deferred = $.Deferred();

                    $.each(elements, function(index, element) {

                        if ( ! shouldInclude(element)) {
                            end(index, length, deferred);
                            return true;
                        }

                        if ( element.rules === undefined || element.rules.length === 0 ) {
                            end(index, length, deferred);
                            return true;
                        }

                        element.rules = element.rules.split('|');

                        $.when(validate(elements, element))
                            .done(function() {
                                end(index, length, deferred);
                            })
                            .fail(function(rule) {
                                error.add(element.name, rule);
                                end(index, length, deferred);
                            });

                    });

                    return deferred.promise();

                }

            };

            var FormBehaviour = $.extend({

                redirect: function(form_model, data) {

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

                fadeOutShowMessage: function(form_model, data) {

                    "use strict";

                    var wrapper = form_model.instance().closest(formWrapper),
                        messageWrapper = wrapper.find(formConfirmation);

                    form_model.instance().fadeOut(200, function() {

                        messageWrapper.html(data.message).fadeIn(200);

                    });


                },

                fadeOutShowMessageRedirect: function(form_model, data) {

                    "use strict";

                    var wrapper = form_model.instance().closest(formWrapper),
                        messageWrapper = wrapper.find(formConfirmation);

                    form_model.instance().fadeOut(200, function() {

                        messageWrapper.html(data.message).fadeIn(200, function() {

                            setTimeout(function() {

                                window.location.href = data.redirect;

                            }, 3000);

                        });

                    });


                },

                fadeOutShowMessageReload: function(form_model, data) {

                    "use strict";

                    var wrapper = form_model.instance().closest(formWrapper),
                        messageWrapper = wrapper.find(formConfirmation);

                    form_model.instance().fadeOut(200, function() {

                        messageWrapper.html(data.message).fadeIn(200, function() {

                            setTimeout(function() {

                                window.location.reload(true);

                            }, 3000);

                        });

                    });


                },

                fadeOutShowMessageResetFadeIn: function(form_model, data) {

                    "use strict";

                    var wrapper = form_model.instance().closest(formWrapper),
                        messageWrapper = wrapper.find(formConfirmation);

                    form_model.instance().fadeOut(200, function() {

                        Form.endRequest(form_model);

                        messageWrapper.html(data.message).fadeIn(200);

                        setTimeout(function() {

                            messageWrapper.fadeOut(200, function() {

                                form_model.instance()[0].reset();
                                form_model.instance().fadeIn(200);

                            });

                        }, 3000);

                    });

                },

                callReplaceRemove: function(form_model, data) {

                    "use strict";

                    Document.replace(data);
                    Document.remove(data);

                },

                ask: function(form_model, data) {

                    "use strict";

                    if ( ! this.hasOwnProperty(data.behaviour)) {
                        throw new Error('Behaviour not specified.');
                    }

                    this[data.behaviour](form_model, data);

                },

                run: function(form_model, data) {

                    "use strict";

                    var behaviour = form_model.successBehaviour();

                    if ( ! this.hasOwnProperty(behaviour)) {
                        throw new Error('Behaviour does not exist.');
                    }

                    this[behaviour](form_model, data);

                }

            }, settings.extendBehaviours);



            var FormModel = function(form) {

                "use strict";

                var data = form.serializeArray(),
                    inputs = serialize(form.find(':input').not(settings.ignoreElements)),
                    method = form.prop('method'),
                    action = form.prop('action'),
                    successBehaviour = form.data('success-behaviour');

                function serialize(elements) {

                    "use strict";

                    var serializedArray = [],
                        arrays = [],
                        radios = [];

                    elements.each(function(index, element) {

                        var $this = $(element),
                            nameAttribute = $this.attr(settings.serializeAttribute);

                        if (!nameAttribute) {
                            return;
                        }

                        var fullName = nameAttribute.split('['),
                            id = $this.attr('id'),
                            params = {
                                name: fullName[0],
                                type: element.type,
                                rules: $this.data('validate'),
                                isArray: fullName.length > 1,
                                isChecked: $this.is(':checked'),
                                isVisible: $this.is(':visible'),
                                isEditor: $this.hasClass('editor'),
                                regex: $this.data('regex')
                            };

                        if ($this.hasClass(settings.classCkEditor)) {
                            params.value = window.CKEDITOR.instances[id].getData();
                            replaceCkEditor(id, params.value);
                        } else {
                            params.value = $this.val();
                        }

                        if (params.type === 'radio') {

                            if (radios[params.name]) {

                                if (!params.isChecked) {
                                    return;
                                }

                                params.rules = serializedArray[radios[params.name]].rules;
                                serializedArray.splice(radios[params.name], 1, params);
                                return;

                            }

                            radios[params.name] = serializedArray.length;

                        }

                        if (params.isArray) {

                            if (arrays[params.name]) {

                                if (params.type === 'checkbox' && !params.isChecked) {
                                    return;
                                }

                                serializedArray[arrays[params.name]].value.push(params.value);
                                return;

                            } else {

                                params.value = [params.value];

                                if (params.type === 'checkbox' && !params.isChecked) {
                                    params.value = [];
                                }

                                arrays[params.name] = serializedArray.length;
                            }
                        }

                        serializedArray.push(params);

                    });

                    return serializedArray;

                }

                function replaceCkEditor(name, value) {
                    $.each(data, function(index, item) {
                        if (item.name === name) {
                            data[index].value = value;
                        }
                    });
                }

                function validateOptions() {

                    "use strict";

                    if (method === undefined) {

                        method = 'post';

                    }

                    if (action === undefined) {

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

                    return method;

                };

                this.action = function() {

                    "use strict";

                    return action;

                };

                this.successBehaviour = function() {

                    "use strict";

                    return successBehaviour;

                };

                this.inputs = function() {

                    "use strict";

                    return inputs;

                };

                this.data = function() {

                    "use strict";

                    return data;

                };

                this.validate = function() {

                    "use strict";

                    return (new Validator(this, new ErrorCollection)).run();

                };

                this.reset = function() {

                    "use strict";

                    form.trigger('reset');

                }

            };

            var Form = {

                clearErrors: function(form_model) {

                    "use strict";

                    form_model.instance().find(
                        formValidationSegment + ' ' + formValidationCase
                    ).removeClass(settings.classShow);

                },

                displayAlert: function(content) {

                    "use strict";

                    // TODO - to implement

                },

                displayErrors: function(form_model, errors) {

                    "use strict";

                    var index;

                    for (var key in errors) {

                        if (errors.hasOwnProperty(key)) {

                            if (key === 'alert') {

                                this.displayAlert(errors[key]);

                                continue;

                            }

                            index = $.isArray(errors[key]) ? errors[key][0] : errors[key];

                            form_model
                                .instance()
                                .find(
                                    '[' + settings.dataValidationSegment + '="' + key + '"] ' +
                                    '[' + settings.dataValidationCase + '="' + index + '"]'
                                )
                                .addClass(settings.classShow);

                        }

                    }

                },

                beginRequest: function(form_model) {

                    "use strict";

                    if (form_model.instance().data('quiet')) {
                        return true;
                    }

                    form_model.instance().find(formSubmitTrigger).addClass(settings.classHide);
                    form_model.instance().find(formSubmitPending).removeClass(settings.classHide);

                },

                endRequest: function(form_model) {

                    "use strict";

                    if (form_model.instance().data('quiet')) {
                        return true;
                    }

                    form_model.instance().find(formSubmitTrigger).removeClass(settings.classHide);
                    form_model.instance().find(formSubmitPending).addClass(settings.classHide);

                },

                successBehaviour: function(form_model, data) {

                    "use strict";

                    FormBehaviour.run(form_model, data);

                },

                disableForm: function(form_model) {

                    "use strict";

                    this.submitted = form_model;

                },

                enableForm: function() {

                    "use strict";

                    this.submitted = null;

                },

                endRequestDisplayErrors: function(form_model, errors) {

                    "use strict";

                    this.endRequest(form_model);
                    this.displayErrors(form_model, errors);

                },

                endRequestDisplayErrorsReset: function(form_model, errors) {

                    "use strict";

                    this.endRequestDisplayErrors(form_model, errors);
                    form_model.reset();

                },

                formAction: function(form_model, success, error, fail) {

                    "use strict";

                    var $this = this;

                    $.when(form_model.validate())
                        .done(function(data, textStatus, jqXHR) {

                            $this.beginRequest(form_model);

                            settings.actionMethod($this, form_model, success, error);

                        })
                        .fail(fail);

                },

                submit: function(instance) {

                    "use strict";

                    var $this = this;

                    $(instance).on('submit', function(event) {

                        event.preventDefault();

                        var form_model = new FormModel($(this));

                        $this.clearErrors(form_model);

                        $this.formAction(
                            form_model,
                            function(data) {

                                settings.postAjaxSuccess(
                                    $this, form_model, data
                                );

                            },
                            function(jqXHR, textStatus, errorThrown) {

                                settings.postAjaxFailure(
                                    $this,
                                    form_model,
                                    jqXHR,
                                    textStatus,
                                    errorThrown
                                )

                            },
                            function(errors) {

                                $this.endRequestDisplayErrors(form_model, errors);

                            }
                        );

                    });

                },

                init: function(instance) {

                    "use strict";

                    this.submit(instance);

                }

            };

            return Form.init(this);
        };

    })();

}));
