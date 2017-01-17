package org.ohf.bean.DTO;

import java.math.BigDecimal;

/**
 * Created by Laurie on 1 Nov 2016.
 */
public class TotalProgramDTO {
    private Long programId;
    private String programName;
    private Long activityId;
    private Integer month;
    private BigDecimal expense;
    private BigDecimal totalBudget;
    private String hexColor;

    public String getHexColor() {
        return hexColor;
    }

    public void setHexColor(String hexColor) {
        this.hexColor = hexColor;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TotalProgramDTO that = (TotalProgramDTO) o;

        return !(programId != null ? !programId.equals(that.programId) : that.programId != null);

    }

    @Override
    public int hashCode() {
        return programId != null ? programId.hashCode() : 0;
    }
}
