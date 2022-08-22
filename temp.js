var time = $('#time').clockpicker({
    autoclose: true,
    donetext: 'Done'
});

$('#sub').click(function(e){
    // Have to stop propagation here
    e.stopPropagation();
    time.clockpicker('show')
            .clockpicker('toggleView', 'hours');
});

var resetTime = $('#resetTime').clockpicker({
    autoclose: true,
    donetext: 'Done'
});

$('#sub1').click(function(e){
    // Have to stop propagation here
    e.stopPropagation();
    resetTime.clockpicker('show')
            .clockpicker('toggleView', 'hours');
});