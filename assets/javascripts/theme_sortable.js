/*------- TODO: Remove these styles Redmine v3.3 or higher -----------*/
(function ($) {
    $.fn.positionedItems = function (sortableOptions, options) {
        var settings = $.extend({
            firstPosition: 1
        }, options);

        return this.sortable($.extend({
            axis: 'y',
            handle: ".sort-handle",
            helper: function (event, ui) {
                ui.children('td').each(function () {
                    $(this).width($(this).width());
                });
                return ui;
            },
            update: function (event, ui) {
                var sortable = $(this);
                var handle = ui.item.find(".sort-handle").addClass("ajax-loading");
                var url = handle.data("reorder-url");
                var param = handle.data("reorder-param");
                var data = {};
                data[param] = {
                    position: ui.item.index() + settings['firstPosition']
                };
                $.ajax({
                    url: url,
                    type: 'put',
                    dataType: 'script',
                    data: data,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR.status);
                        sortable.sortable("cancel");
                    },
                    complete: function (jqXHR, textStatus, errorThrown) {
                        handle.removeClass("ajax-loading");
                    }
                });
            },
        }, sortableOptions));
    }
}(jQuery));
