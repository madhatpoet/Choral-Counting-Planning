$( document ).ready(function() {
    function findAB(eq)
    {
        eq = eq.trim();
        eq = eq.replace(" ","");
        var terms;
        var negA = false;
        var negB = false;
        if (eq.includes("+"))
        {
            terms = eq.split("+");
        }
        else if(eq.includes("-"))
        {
            if(eq.startsWith("-"))
            {
                eq = eq.slice(1);
                negA = true;
            }
            terms = eq.split("-");
            negB = true;
        }
        terms[0] = terms[0].replace("x","");
        if(terms[0] == "")
        {
            terms[0] = 1;
        }
        else if(terms[0] == "-")
        {
            terms[0] = -1;
        }
        else
        {
            terms[0] = parseInt(terms[0]);
        }

        terms[1] = parseInt(terms[1]);
        if(negA)
        {
            terms[0] *= -1;
        }
        if(negB)
        {
            terms[1] *= -1;
        }
        return terms
    }

    function generateExpression(values)
    {
        var a = values[0];
        var b = values[1];
        var expression = "";
        if (a == 1)
        {
            expression += "x";
        }
        else if(a == -1)
        {
            expression += "-x";
        }
        else
        {
            expression += a + "x";
        }

        if (b>=0)
        {
            expression += " + " + b;
        }
        else
        {
            b *= -1;
            expression += " - " + b;
        }
        return expression;
    }

    function incrementValues(initial, increment)
    {
        return [initial[0] + increment[0],initial[1] + increment[1]];
    }
    
    function generateTableNums(start,increment,columns,rows)
    {
        var value = start;
        var html = "";
        for(let i = 1; i<=rows; i++)
        {
            var row_html = "\t<tr>";
            for(let j = 1; j<=columns; j++)
            {
                row_html += "\n\t\t" + "<td>" + value + "</td>";
                value += increment;
            }
            row_html += "\n\t</tr>\n";
            html += row_html;
        }
        return html;
    }

    function generateTableExpression(start,increment,columns,rows)
    {
        var values = start;
        var html = "";
        for(let i = 1; i<=rows; i++)
        {
            var row_html = "\t<tr>";
            for(let j = 1; j<=columns; j++)
            {
                var expression = generateExpression(values);
                row_html += "\n\t\t" + "<td>" + expression + "</td>";
                values = incrementValues(values,increment);
            }
            row_html += "\n\t</tr>\n";
            html += row_html;
        }
        return html;
    }
    
    function refreshTable()
    {
        var start = $("#start").val();
        var increment = $("#increment").val();
        const columns = parseInt($("#columns").val());
        const rows = parseInt($("#rows").val());
        var html = "";
        if (start.includes("x") || start.includes("X"))
        {
            start = findAB(start);
            increment = findAB(increment);
            html = generateTableExpression(start,increment,columns,rows);
        }
        else
        {
            html = generateTableNums(parseInt(start),parseInt(increment),columns,rows);
        }
        $("#choral-table").html(html);
    }

    function setDefaultValues()
    {
        $("#start").val(1);
        $("#increment").val(1);
        $("#columns").val(5);
        $("#rows").val(5);
    }
    
    $(".control-input").focusout(function() {
        refreshTable();
      })

      $(document).on('keypress',function(e) {
        if(e.which == 13) {
            refreshTable();
        }
    });

    setDefaultValues();
    refreshTable();
});