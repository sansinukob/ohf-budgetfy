package org.evey.bean;

import org.evey.annotation.Auditable;
import org.evey.annotation.UniqueField;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;


@Entity
@Table(name="REFERENCE_LOOKUP")
@Auditable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReferenceLookUp extends BaseEntity {

	private static final long serialVersionUID = -6121332155380808473L;
	
	@Column(name = "CATEGORY_", nullable = false)
	@UniqueField
	private String category;
	
	@Column(name = "KEY_", unique = true, nullable = false)
	@UniqueField
	private String key;
	
	@Column(name = "VALUE_", nullable = false)
	private String value;
	
	@Column(name = "NUMBER_VALUE")
	private Integer numberValue;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_", referencedColumnName = "KEY_")
	private ReferenceLookUp parentLookUp;
	
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Integer getNumberValue() {
		return numberValue;
	}
	public void setNumberValue(Integer numberValue) {
		this.numberValue = numberValue;
	}
	public ReferenceLookUp getParentLookUp() {
		return parentLookUp;
	}
	public void setParentLookUp(ReferenceLookUp parentLookUp) {
		this.parentLookUp = parentLookUp;
	}
	
	@Override
	public String toString() {
		return "ReferenceLookUp [key=" + key + ", value=" + value + "]";
	}
}
