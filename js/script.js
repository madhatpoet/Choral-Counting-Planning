$( document ).ready(function() {
    function checkForAny(str, lookFor)
    {
        for(let i = 0; i < lookFor.length; i++)
        {
            if(str.includes(lookFor[i]))
            {
                return true;
            }
        }
        return false;
    }
    function checkForAll(str, lookFor)
    {
        for(let i = 0; i < lookFor.length; i++)
        {
            if(!str.includes(lookFor[i]))
            {
                return false;
            }
        }
        return true;
    }
    function numberOfDecimalPlaces(n)
    {
        const n_str = "" + n;
        if (n_str.includes("."))
        {
            const n_split = n_str.split(".");
            const decimals = n_split[1];
            return decimals.length;
        }
        return 0;
    }
    function fixDecimal(value,num1,num2)
    {
        const num_1_d = numberOfDecimalPlaces(num1);
        const num_2_d = numberOfDecimalPlaces(num2);
        var dec_places = num_1_d;
        if (num_2_d > num_1_d)
        {
            dec_places = num_2_d;
        }
        return parseFloat(value.toFixed(dec_places));
    }
    function findAB(eq)
    {
        eq = eq.trim();
        eq = eq.replace(" ","");
        var terms;
        var negA = false;
        var negB = false;

        // Special Cases
        if(!eq.includes("x")) // 0x + b
        {
            return [0,parseFloat(eq)];
        }
        if(!checkForAny(eq.slice(1),["+","-"]) && checkForAny(eq,["x"])) // ax + 0
        {
            eq = eq.replace("x","");
            if (eq == "-")
            {
                eq = "-1";
            }
            if (eq == "")
            {
                eq = "1";
            }
            return [parseFloat(eq),0];
        }

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
            terms[0] = parseFloat(terms[0]);
        }

        terms[1] = parseFloat(terms[1]);
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
    function findRationalValues(numText)
    {
        var negative  = false;
        if (numText.includes("-"))
        {
            negative = true;
            numText = numText.replace("- ","");
            numText = numText.replace("-","");
        }
        if (numText.includes("/"))
        {
            var mixedNumber = false;
            var wholeNumber = 0;
            if (numText.includes(" "))
            {
                mixedNumber = true;
                numSplit = numText.split(" ");
                wholeNumber = numSplit[0];
                wholeNumber = parseInt(wholeNumber);
                numText = numSplit[1];
            }
            var frac = numText.split("/");
            var a = frac[0];
            a = parseFloat(a);
            var b = frac[1];
            b = parseFloat(b);
            return [wholeNumber,a,b,mixedNumber,negative];
        }
        return [parseFloat(numText),0,0,true,negative];
    }

    function mixedNumberAgreement(num_1,num_2,mixedNumbers)
    {
        var num_1_whole = num_1[0];
        var num_1_numerator = num_1[1];
        var num_1_denominator = num_1[2];
        var num_1_negative = num_1[4];
        var num_2_whole = num_2[0];
        var num_2_numerator = num_2[1];
        var num_2_denominator = num_2[2];
        var num_2_negative = num_2[4];
        var divisors = [];

        if (num_1_denominator == 0)
        {
            if(num_2_denominator == 0)
            {
                num_2_numerator = 0;
                num_2_denominator = 1;
            }
            num_1_numerator = 0;
            num_1_denominator = num_2_denominator;
        }

        if (num_1_denominator != num_2_denominator && num_1_denominator != 0 && num_2_denominator !=0)
        {
            divisors = [num_1_denominator,num_2_denominator]
            num_1_numerator *= num_2_denominator;
            num_2_numerator *= num_1_denominator;
            num_1_denominator *= num_2_denominator;
            num_2_denominator = num_1_denominator;
        }

        if (num_1_denominator == 0)
        {
            num_1_denominator = 1;
        }
        if (num_2_denominator == 0)
        {
            num_2_denominator = 1;
        }

        if (mixedNumbers)
        {
            if (num_1_numerator >= num_1_denominator)
            {
                var leftOver = num_1_numerator % num_1_denominator;
                num_1_whole += (num_1_numerator - leftOver) / num_1_denominator;
                num_1_numerator = leftOver;
            }

            if (num_2_numerator >= num_2_denominator)
            {
                var leftOver = num_2_numerator % num_2_denominator;
                num_2_whole += (num_2_numerator - leftOver) / num_2_denominator;
                num_2_numerator = leftOver;
            }
        }
        
        var return_values = [[num_1_whole,num_1_numerator,num_1_denominator,num_1_negative],[num_2_whole,num_2_numerator,num_2_denominator,num_2_negative],divisors];
        return return_values;
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

    function generateRational(value,divisors,mixedNumber)
    {
        var html = "";
        var a = value[0];
        var b = value[1];
        var c = value[2];
        if (b % divisors[0] == 0)
        {
            b /= divisors[0];
            c /= divisors[0];
        }
        if (b % divisors[1] == 0)
        {
            b /= divisors[1];
            c /= divisors[1];
        }
        if (c == 1)
        {
            if (divisors[0]<divisors[1])
            {
                b *= divisors[0];
                c *= divisors[0];
            }
            else if (divisors[1]<divisors[0])
            {
                b *= divisors[1];
                c *= divisors[1];
            }
        }
        const neg = value[3];
        var neg_text = ""
        if (neg)
        {
           neg_text = "- ";
        }
        html = "<div class='fraction'><div class='numerator'>" + b + "</div><div class='denominator'>" + c + "</div></div>";
        if (mixedNumber)
        {
            html = "<div class='mixed-number'>" + "<div class='left-part'><span>" +  neg_text + a + "</span></div>" + html + "</div>";
        }
        return html;
    }

    function incrementValues(initial, increment)
    {
        var newValues = [];
        for(let i = 0; i<initial.length;i++)
        {
            newValues[i] = initial[i] + increment[i];
        }
        return newValues;
    }
    
    function incrementRational(num_1, num_2, mixedNumbers)
    {
        var num_1_whole = num_1[0];
        var num_1_numerator = num_1[1];
        var num_1_denominator = num_1[2];
        var num_1_negative = num_1[3];
        var num_2_whole = num_2[0];
        var num_2_numerator = num_2[1];
        var num_2_denominator = num_2[2];
        var num_2_negative = num_2[3];
        if(mixedNumbers)
        {
            if(num_1_negative == num_2_negative)
            {
                var whole = num_1_whole + num_2_whole;
                var numerator = num_1_numerator + num_2_numerator;
                var denominator = num_1_denominator;
                var negative = num_1_negative;
                var leftOver = numerator % denominator;
                whole += (numerator - leftOver) / denominator;
                numerator = leftOver;
                return [whole,numerator,denominator,negative];
            }
            var whole = num_1_whole - num_2_whole;
            var numerator = num_1_numerator - num_2_numerator;
            var denominator = num_1_denominator;
            var negative = num_1_negative;
            if (whole < 0 && numerator < 0)
            {
                negative = !negative;
                whole *= -1;
                numerator *= -1;
            }
            else if (whole < 0 && numerator > 0)
            {
                negative = !negative;
                whole *= -1;
            }
            else if (whole > 0 && numerator < 0)
            {
                whole -= 1;
                numerator += denominator;
            }
            else if (whole == 0 && numerator < 0)
            {
                negative = !negative;
                numerator *= -1
            }
            else if (whole < 0 && numerator == 0)
            {
                whole *= -1;
                negative = !negative;
            }
            else if (whole == 0 && numerator == 0)
            {
                negative = false;
            }
            return [whole,numerator,denominator,negative];
        }
            if (num_1_negative)
            {
                num_1_numerator *= -1;
            }
            if (num_2_negative)
            {
                num_2_numerator *= -1;
            }
            var new_numerator = num_1_numerator + num_2_numerator;
            var negative = false;
            if (new_numerator<0)
            {
                negative = true;
                new_numerator *= -1;
            }
            return [0,new_numerator,num_1_denominator,negative];
    }

    function generateTableFib(first,second,columns,rows)
    {
        var html = "\t<tr>" + "\n\t\t" + "<td>" + first + "</td>\n";
        html += "\t\t" + "<td>" + second + "</td>\n";
        var a = first;
        var b = second;
        for(let i = 3; i<=columns; i++)
        {
            var value = a + b;
            html += "\n\t\t" + "<td>" + value + "</td>";
            a = b;
            b = value;
            value = fixDecimal(value,first,a-b);
        }
        html += "\t</tr>\n";
        for(let i = 1; i<=rows - 1; i++)
        {
            var row_html = "\t<tr>";
            for(let j = 1; j<=columns; j++)
            {
                var value = a + b;
                row_html += "\n\t\t" + "x<td>" + value + "</td>";
                a = b;
                b = value;
                value = fixDecimal(value,first,a-b);
            }
            row_html += "\n\t</tr>\n";
            html += row_html;
        }
        return html;
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
                value = fixDecimal(value,start,increment);
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

    function generateTableRational(start,increment,columns,rows)
    {
        const mixedNumbers = start[3] || increment[3];
        var agreement = mixedNumberAgreement(start,increment,mixedNumbers);
        var value = agreement[0];
        increment = agreement[1];
        divisors = agreement[2];
        var html = "";
        for(let i = 1; i<=rows; i++)
        {
            var row_html = "\t<tr>";
            for(let j = 1; j<=columns; j++)
            {
                var numberPrint = generateRational(value,divisors,mixedNumbers);
                row_html += "\n\t\t" + "<td>" + numberPrint + "</td>";
                value = incrementRational(value,increment,mixedNumbers);
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
        if (checkForAny(start,["x","X"]) || checkForAny(increment,["x","X"])) //Check if either is an expression
        {
            start = findAB(start);
            increment = findAB(increment);
            html = generateTableExpression(start,increment,columns,rows);
        }
        else if(checkForAny(start,["/"]) || checkForAny(increment,["/"])) //Check if either is a fraction or mixed number
        {
            start = findRationalValues(start);
            increment = findRationalValues(increment);
            html = generateTableRational(start,increment,columns,rows);
        }
        else if(checkForAny(start,["fib"]) || checkForAny(increment,["fib"]))
        {
            start = start.replace("fib","");
            start = start.replace("  ","");
            increment = increment.replace("fib","");
            increment = increment.replace(" ","");
            if (increment == "" || increment == " ")
            {
                increment = start;
            }
            html = generateTableFib(parseFloat(start),parseFloat(increment),columns,rows);
        }
        else
        {
            html = generateTableNums(parseFloat(start),parseFloat(increment),columns,rows);
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
    
    $(".control-input").change(function() {
        refreshTable();
      }); 	

    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            refreshTable();
        }
    });

    setDefaultValues();
    refreshTable();
});