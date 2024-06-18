(function($) {
    $(document).ready(function() {
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
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function(event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function(event, currentIndex) {
                updateSelectedCategories();
                updateSchedule();
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
                            window.location.href = '/home/drop-detail/' + response.locationId;
                        } else {
                            alert('Failed to submit form: Location ID is missing');
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Error submitting form: ' + xhr.responseText);
                    }
                });
            },
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

        function toggleCollapseAndInput(checkbox, collapseId) {
            var collapse = $(collapseId);
            var inputs = collapse.find("input[type='time']");
            if (checkbox.prop("checked")) {
                collapse.collapse('show');
                inputs.prop('disabled', false);
            } else {
                collapse.collapse('hide');
                inputs.prop('disabled', true);
                inputs.val('');
            }
        }

        $('[name="schedule_day"]').change(function() {
            var targetId = $(this).data('bs-target');
            toggleCollapseAndInput($(this), targetId);
        });

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

        function updateSelectedCategories() {
            const selectedCards = document.querySelectorAll('.crd.card-selected');
            const selectedCategoryIds = Array.from(selectedCards).map(card => card.getAttribute('data-category-id'));
            document.getElementById('selectedCategories').value = JSON.stringify(selectedCategoryIds);
        }
        
        function updateSchedule() {
            const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
            const schedule = days.map(day => {
                const dayId = day.toLowerCase();
                if ($(`#${dayId}`).prop("checked")) {
                    return {
                        day: dayId,
                        open_time: $(`#open_time_${dayId}`).val(),
                        close_time: $(`#close_time_${dayId}`).val()
                    };
                }
                return null;
            }).filter(day => day !== null);
            document.getElementById('schedule').value = JSON.stringify(schedule);
        }
    });
})(jQuery);
