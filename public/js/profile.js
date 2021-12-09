$(function () {

    $('#form-password').submit(function (event) {

        $('#pwd-hint').removeClass('invisible');

        fieldChecker.setFieldPass('input-old-pwd');
        fieldChecker.setFieldPass('input-new-pwd');
        fieldChecker.setFieldPass('input-confirm-pwd');

        for (var i = 1; i <= 6; i++) {
            fieldChecker.setRulePass(i.toString());
        }

        var res = true;
        res &= fieldChecker.checkFieldFormat('input-old-pwd');
        res &= fieldChecker.checkFieldFormat('input-new-pwd');
        res &= fieldChecker.checkFieldEqual('input-new-pwd', 'input-confirm-pwd', '6');

        if (res == true) {
            res = confirm('Are you sure you want to change password?');
        }

        if (!res) {
            event.preventDefault();
            return false;
        }
        return true;

    });

});

var passwordChecker = {
    isHaveLowerChar: function (pwd) {
        return pwd.match(/[a-z]/) != null;
    },
    isHaveUpperChar: function (pwd) {
        return pwd.match(/[A-Z]/) != null;
    },
    isHaveDigit: function (pwd) {
        return pwd.match(/\d/) != null;
    },
    isHaveSpecial: function (pwd) {
        return pwd.match(/[`~!@#\$%\^&\*\(\)\-=_+\\\[\]{}/\?,\.\<\>]/) != null;
    },
    isHaveLength: function (pwd, len) {
        return pwd.length >= len;
    }
}

var fieldChecker = {

    checkFieldFormat: function (id) {
        var pwd = $('#' + id).val();
        var isPass = true;
        if (!passwordChecker.isHaveLowerChar(pwd)) {
            this.setFieldFail(id);
            this.setRuleFail('1');
            isPass = false;
        }
        if (!passwordChecker.isHaveUpperChar(pwd)) {
            this.setFieldFail(id);
            this.setRuleFail('2');
            isPass = false;
        }
        if (!passwordChecker.isHaveDigit(pwd)) {
            this.setFieldFail(id);
            this.setRuleFail('3');
            isPass = false;
        }
        if (!passwordChecker.isHaveSpecial(pwd)) {
            this.setFieldFail(id);
            this.setRuleFail('4');
            isPass = false;
        }
        if (!passwordChecker.isHaveLength(pwd, 8)) {
            this.setFieldFail(id);
            this.setRuleFail('5');
            isPass = false;
        }
        return isPass;
    },
    checkFieldEqual: function (srcId, dstId, ruleId) {
        if ($('#' + srcId).val() == $('#' + dstId).val()) {
            return true;
        }
        $('#' + dstId).addClass('border-red-500');
        this.setRuleFail(ruleId);
        return false;
    },

    setFieldStatus: function (id, isPass) {
        if (isPass) {
            $('#' + id).removeClass('border-red-500');
        } else {
            $('#' + id).addClass('border-red-500');
        }
    },
    setFieldPass: function (id) {
        this.setFieldStatus(id, true);
    },
    setFieldFail: function (id) {
        this.setFieldStatus(id, false);
    },

    setRuleStatus: function (ruleId, isPass) {

        if (isPass) {
            $('#pass-rule-' + ruleId).show();
            $('#fail-rule-' + ruleId).hide();
        } else {
            $('#pass-rule-' + ruleId).hide();
            $('#fail-rule-' + ruleId).show();
        }
    },

    setRulePass: function (ruleId) {
        this.setRuleStatus(ruleId, true)
    },
    setRuleFail: function (ruleId) {
        this.setRuleStatus(ruleId, false)
    }


}