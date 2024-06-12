(function($) {
    $(document).ready(function() {
        console.log("main.js is loaded successfully");

        var form = $("#signup-form");
        form.validate({
            errorPlacement: function errorPlacement(error, element) {
                element.before(error);
            },
            rules: {
                email: {
                    email: true
                }
            },
            onfocusout: function(element) {
                $(element).valid();
            },
        });

        form.children("div").steps({
            headerTag: "h3",
            bodyTag: "fieldset",
            transitionEffect: "fade",
            stepsOrientation: "vertical",
            titleTemplate: '<div class="title"><span class="step-number">#index#</span><span class="step-text">#title#</span></div>',
            labels: {
                previous: 'Previous',
                next: 'Next',
                finish: 'Finish',
                current: ''
            },
            onStepChanging: function(event, currentIndex, newIndex) {
                form.parent().parent().parent().find('.footer').remove();
                form.parent().parent().parent().append('<div class="footer footer-' + newIndex + '"></div>');
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function(event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function(event, currentIndex) {
                var formData = new FormData(form[0]);
                $.ajax({
                    url: '/home/submit-form',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        if (response.locationId) {
                            alert('Form successfully submitted');
                            window.location.href = '/drop-detail/' + response.locationId; // Redirect to drop-off page
                            deleteForm(); // Call deleteForm function after successful submission
                        } else {
                            console.error('Location ID is missing in the response:', response);
                            alert('Failed to submit form: Location ID is missing');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error submitting form:', error);
                        alert('Error submitting form: ' + xhr.responseText); // Display the error message received from the server
                    }
                });
            },
            onStepChanged: function(event, currentIndex, priorIndex) {
                return true;
            }
        });

        jQuery.extend(jQuery.validator.messages, {
            required: "",
            remote: "",
            email: "",
            url: "",
            date: "",
            dateISO: "",
            number: "",
            digits: "",
            creditcard: "",
            equalTo: ""
        });

        // Function to handle collapse and input fields based on checkbox status
        function toggleCollapseAndInput(checkbox, collapseId) {
            var collapse = $(collapseId);
            var inputs = collapse.find("input[type='time']");
            if (checkbox.prop("checked")) {
                collapse.collapse('show');
                inputs.prop('disabled', false);
            } else {
                collapse.collapse('hide');
                inputs.prop('disabled', true);
                // Reset input values when collapsing
                inputs.val('');
            }
        }

        // Loop through each checkbox with name schedule_day
        $('[name="schedule_day"]').change(function() {
            var targetId = $(this).data('bs-target');
            toggleCollapseAndInput($(this), targetId);
        });

        // Show the appropriate collapse when the page loads
        const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
        days.forEach(day => {
            const checkbox = $(`#${day}`);
            const collapseId = `#collapse${day.charAt(0).toUpperCase() + day.slice(1)}`;
            toggleCollapseAndInput(checkbox, collapseId);
        });

        function readFiles(input) {
            if (input.files) {
                var filesAmount = input.files.length;
                var previewZone = $(input).closest('.form-group').find('.preview-zone');
                var boxBody = previewZone.find('.box-body');
                
                boxBody.empty();
                for (var i = 0; i < filesAmount; i++) {
                    var reader = new FileReader();
                    reader.onload = (function(event) {
                        return function(e) {
                            var htmlPreview = '<img src="' + e.target.result + '"/>';
                            boxBody.append(htmlPreview);
                        };
                    })(input.files[i]);
                    reader.readAsDataURL(input.files[i]);
                }
                previewZone.removeClass('hidden');
            }
        }

        function resetForm() {
            $('.preview-zone').addClass('hidden');
            $('.preview-zone .box-body').empty();
            $('.dropzone').val('');
        }

        $(document).on('change', '.dropzone', function() {
            readFiles(this);
        });

        $(document).on('click', '.remove-preview', function() {
            resetForm();
        });

        // Define the toggleCardSelection function
        function toggleCardSelection(card) {
            card.classList.toggle('card-selected');
        }

        $('.crd').click(function() {
            toggleCardSelection(this);
        });

        function openTab(event) {
            const tabName = event.target.getAttribute('data-tab');
            const tabContents = document.querySelectorAll('.tab-content');
            const navItems = document.querySelectorAll('.nav-item');
            tabContents.forEach((content) => {
                content.classList.remove('active');
            });
            navItems.forEach((item) => {
                item.classList.remove('active');
            });
            document.querySelector(`#${tabName}`).classList.add('active');
            event.target.classList.add('active');
        }

        const tabButtons = document.querySelectorAll('.nav-item');
        tabButtons.forEach((button) => {
            button.addEventListener('click', openTab);
        });

        // Function to delete form data
        function deleteForm() {
            // Add logic to delete data from the form here
            // For example, clear the values of each input field or reset the form to its initial state
            form.find('input[type="text"], input[type="email"]').val('');
        }

        // Function to update selected categories
        function updateSelectedCategories() {
            const selectedCards = document.querySelectorAll('.crd.card-selected');
            const selectedCategories = Array.from(selectedCards).map(card => card.getAttribute('data-category-id'));
            document.getElementById('selectedCategories').value = JSON.stringify(selectedCategories);
        }
    });
})(jQuery);
