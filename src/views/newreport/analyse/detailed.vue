<template>
  <div class="app-container">
    <div class="PerformanceData-sea">
      <el-card class="box-card">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
        >
          <el-form-item label="" prop="timeType">
            <el-select v-model="timeType">
              <el-option label="按年统计" :value="1" />
              <el-option label="按月统计" :value="2" />
              <el-option label="按周统计" :value="3" />
              <el-option label="按日统计" :value="4" />
              <!-- <el-option label="按年统计" :value="3" /> -->
            </el-select>
          </el-form-item>

          <el-form-item label="" prop="timeValueBegin">
            <el-date-picker
              v-if="timeType == 1"
              v-model="queryParams.timeValueBegin"
              value-format="yyyy"
              type="year"
              placeholder="开始年份"
              :clearable="false"
              :editable="false"
            >
            </el-date-picker>
            <!-- 这是周的选择日期 -->
            <el-form-item label="" v-if="timeType == 3" prop="">
              <Chooseweek
                ref="Chooseweek"
                :passRank="queryParams"
                @sallBusiness="date"
              ></Chooseweek>
            </el-form-item>

            <el-date-picker
              v-if="timeType != 1 && timeType != 3"
              v-model="dateMonth"
              :type="pickerType"
              :value-format="valueFormat"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>

          <el-form-item label="" prop="timeValueEnd">
            <el-date-picker
              v-if="timeType == 1"
              v-model="queryParams.timeValueEnd"
              type="year"
              value-format="yyyy"
              placeholder="结束年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="showDepartSelect == true" label="" prop="deptIds">
            <treeselect
              :flat="true"
              @input="treeselectinput"
              v-model="getTreeselectArr1"
              appendToBody
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              :clearable="false"
              placeholder="请选择归属部门"
            />
          </el-form-item>

          <el-form-item label="" prop="userId">
            <el-select
              :disabled="!showList"
              style="width: 100%"
              v-model="queryParams.userId"
              filterable
              placeholder="请输入关键字搜索用户"
              @input="selectInput"
              remote
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
            <el-button icon="el-icon-back" type="primary" @click="goBack"
              >返回</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="PerformanceData-table">
      <!-- 数据来源占比 部门  type == 1-->
      <el-card v-if="type == 1" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>数据来源占比</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />

          <el-table-column
            align="center"
            label="电话营销 "
            prop="p1"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 1,
                  })
                "
                class="ableClick"
                >{{ row.p1 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="工商客户"
            prop="p2"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 2,
                  })
                "
                class="ableClick"
                >{{ row.p2 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="网络客户"
            prop="p3"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 3,
                  })
                "
                class="ableClick"
                >{{ row.p3 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跨部门客户"
            prop="p4"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 4,
                  })
                "
                class="ableClick"
                >{{ row.p4 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户转介绍"
            prop="p5"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 5,
                  })
                "
                class="ableClick"
                >{{ row.p5 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他途径"
            prop="p6"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 6,
                  })
                "
                class="ableClick"
                >{{ row.p6 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="考场数据"
            prop="p7"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 7,
                  })
                "
                class="ableClick"
                >{{ row.p7 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="渠道数据"
            prop="p8"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 8,
                  })
                "
                class="ableClick"
                >{{ row.p8 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="占比"
            prop="dataSourcePercentage"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.dataSourcePercentage }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="钻取分析">
            <template slot-scope="{ row }">
              <el-button
                @click="handleClick({ type: 1, deptId: row.deptId })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 数据来源占比 人员  type == 2-->
      <el-card v-if="type == 2" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>数据来源占比</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="电话营销"
            prop="p1"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 1,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p1 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="工商客户"
            prop="p2"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 2,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p2 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="网络客户"
            prop="p3"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 3,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p3 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跨部门客户"
            prop="p4"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 4,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p4 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户转介绍"
            prop="p5"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 5,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p5 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他途径"
            prop="p6"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 6,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p6 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="考场数据"
            prop="p7"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 7,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p7 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="渠道数据"
            prop="p8"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 3,
                    deptId: row.deptId,
                    dataSourceType: 8,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.p8 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="占比"
            prop="dataSourcePercentage"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.dataSourcePercentage }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 数据来源占比 部门  数据来源  type == 3-->
      <el-card v-if="type == 3" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>{{ label }}</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="线索名称">
            <template slot-scope="{ row }">
              {{ row.clueName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    userId: row.userId,
                    archiveId: row.archiveId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="notFollowUpDays"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.notFollowUpDays || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 跟进内容量 type == 4-->
      <el-card v-if="type == 4" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>{{ clueName }}</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="followUpTime"
            label="时间"
            align="center"
            sortable="custom"
          />
          <el-table-column
            align="center"
            label="跟进事由"
            prop="title"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.title || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进总结">
            <template slot-scope="{ row }">
              {{ row.content || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="下次跟进时间"
            prop="nextFollowUpTime"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.nextFollowUpTime || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 线索数据 type == 5-->
      <el-card v-if="type == 5" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>线索数据</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="线索名称">
            <template slot-scope="{ row }">
              {{ row.clueTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    userId: row.userId,
                    archiveId: row.archiveId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.unFollowUpDay || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 转商机数据 type == 6-->
      <el-card v-if="type == 6" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>{{ namesang || "转商机数据" }}</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="线索名称">
            <template slot-scope="{ row }">
              {{ row.clueTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="转商机标题">
            <template slot-scope="{ row }">
              {{ row.opportunityTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业名称">
            <template slot-scope="{ row }">
              <!-- {{ row.customerName || 0 }} -->
              {{ row.customerName || row.clueTitle }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    userId: row.userId,
                    archiveId: row.archiveId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.unFollowUpDay || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 转订单数量 type == 7-->
      <el-card v-if="type == 7" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>转订单数据</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="转订单标题">
            <template slot-scope="{ row }">
              {{ row.orderTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单金额"
            prop="orderPrice"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderPrice || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业名称" prop="customerName">
            <template slot-scope="{ row }">
              {{ row.customerName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="原商机名称"
            prop="opportunityTitle"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityTitle || 0 }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="原线索名称"
            prop="clueTitle"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.clueTitle || 0 }}
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.unFollowUpDay || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 转介绍成交客户与成交订单数据 type == 9-->
      <el-card v-if="type == 9" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>转介绍成交客户与成交订单数据</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="转介绍订单标题">
            <template slot-scope="{ row }">
              {{ row.orderTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转介绍订单金额"
            prop="orderPrice"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderPrice || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转介绍订单客户"
            prop="customerName"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.customerName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联客户"
            prop="referralCustomerName"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.referralCustomerName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="原商机名称">
            <template slot-scope="{ row }">
              {{ row.opportunityTitle }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="原线索名称">
            <template slot-scope="{ row }">
              {{ row.clueTitle }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 跟进方式数据 type == 10-->
      <el-card v-if="type == 10" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>跟进方式数据</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column
            v-if="showUsername == true"
            align="center"
            label="姓名"
          >
            <template slot-scope="{ row }">
              {{ row.userName }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="微信"
            prop="wechat"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 3,
                  })
                "
                class="ableClick"
                >{{ row.wechat }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="电话"
            prop="cellphone"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 2,
                  })
                "
                class="ableClick"
                >{{ row.cellphone }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="面谈"
            prop="face"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 1,
                  })
                "
                class="ableClick"
                >{{ row.face }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="短信"
            prop="sms"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 4,
                  })
                "
                class="ableClick"
                >{{ row.sms }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="邮件"
            prop="email"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 5,
                  })
                "
                class="ableClick"
                >{{ row.email }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="QQ"
            prop="qq"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 6,
                  })
                "
                class="ableClick"
                >{{ row.qq }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他"
            prop="other"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 7,
                  })
                "
                class="ableClick"
                >{{ row.other }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="占比"
            prop="rate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.rate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showUsername == false"
            align="center"
            label="钻取分析"
          >
            <template slot-scope="{ row }">
              <el-button
                @click="handleClick({ type: 10, deptId: row.deptId })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 微信跟进数据 type == 11-->
      <el-card v-if="type == 11" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>{{ typeM[queryParams.followUpMethod - 1] }}</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              <span>{{ row.postName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="线索名称">
            <template slot-scope="{ row }">
              <span>{{ row.clueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.followUpCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    userId: row.userId,
                    archiveId: row.archiveId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.followUpDensity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.unFollowUpDay }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 订单 -->
      <!-- 订单状态转化率与占比  type == 12-->
      <el-card v-if="type == 12" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>订单状态转化率与占比列表</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />

          <el-table-column
            align="center"
            label="支付首款"
            prop="firstPayNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 1,
                  })
                "
                class="ableClick"
                >{{ row.firstPayNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="进度款"
            prop="handleNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 2,
                  })
                "
                class="ableClick"
                >{{ row.handleNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="进度款转换率"
            prop="handleConvertRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.handleConvertRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="收取尾款"
            prop="lastPayNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 3,
                  })
                "
                class="ableClick"
                >{{ row.lastPayNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="收取尾款转换率"
            prop="lastPayConvertRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.lastPayConvertRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已办结"
            prop="finishNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 4,
                  })
                "
                class="ableClick"
                >{{ row.finishNum }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="支付全款"
            prop="payAllNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 6,
                  })
                "
                class="ableClick"
                >{{ row.payAllNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已退单"
            prop="refundNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 5,
                  })
                "
                class="ableClick"
                >{{ row.refundNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="退单率"
            prop="refundRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.refundRate }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单状态占比"
            prop="refundRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.orderCountRate }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="钻取分析">
            <template slot-scope="{ row }">
              <el-button
                @click="handleClick({ type: 12, deptId: row.deptId })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <!-- 支付首款状态分析  type == 13-->
      <el-card v-if="type == 13" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>{{ oruer[queryParams.orderStatus - 1] }}状态分析</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              <span>{{ row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单名称">
            <template slot-scope="{ row }">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态">
            <template slot-scope="{ row }">
              <span>{{ oruer[row.orderStatus - 1] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业名称">
            <template slot-scope="{ row }">
              <span>{{ row.companyName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单金额">
            <template slot-scope="{ row }">
              <span>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进次数">
            <template slot-scope="{ row }">
              <span>{{ row.followUpCount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进内容量">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderId: row.orderId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="未跟进天数">
            <template slot-scope="{ row }">
              <span>{{ row.unFollowUpDay }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="关联产品数">
            <template slot-scope="{ row }">
              <span
                @click="$refs.productList.handleClickLisr(row)"
                class="ableClick"
                >{{ row.orderProjectNum || 0 }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <!-- 商机状态转化率与占比 -->
      <el-card v-if="type == 14" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>商机状态转化率与占比</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="发现需求">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o1,
                  })
                "
                class="ableClick"
                >{{ row.p1 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="发现需求转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t1 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="确认需求">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o2,
                  })
                "
                class="ableClick"
                >{{ row.p2 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="确认需求转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t2 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提供解决方案">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o3,
                  })
                "
                class="ableClick"
                >{{ row.p3 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="提供解决方案转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t3 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="促成及处理异议">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o4,
                  })
                "
                class="ableClick"
                >{{ row.p4 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="促成及处理异议转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t4 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合同阶段">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o5,
                  })
                "
                class="ableClick"
                >{{ row.p5 || 0 }}</span
              >
            </template>
          </el-table-column>

          <el-table-column align="center" label="合同阶段转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t5 || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="商机数量占比">
            <template slot-scope="{ row }">
              <span>{{ row.percentage || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="钻取分析">
            <template slot-scope="{ row }">
              <el-button
                @click="handleClick({ type: 14, deptId: row.deptId })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <!-- 发现需求状态分析  type == 15-->
      <el-card v-if="type == 15" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span
              >{{
                opportunityStatus[queryParams.opportunityStatus - 1]
              }}状态分析</span
            >
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="职务">
            <template slot-scope="{ row }">
              <span>{{ row.postName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商机名称">
            <template slot-scope="{ row }">
              <span>{{ row.opportunityTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商机状态">
            <template slot-scope="{ row }">
              <span>{{ opportunityStatus[row.opportunityStatus - 1] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进次数">
            <template slot-scope="{ row }">
              <span>{{ row.followUpCount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进内容量">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    userId: row.userId,
                    archiveId: row.archiveId,
                    clueName: row.clueName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="未跟进天数">
            <template slot-scope="{ row }">
              <span>{{ row.unFollowUpDay }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="关联产品数">
            <template slot-scope="{ row }">
              <span
                @click="$refs.productList.handleClickLisr(row)"
                class="ableClick"
                >{{ row.orderProjectNum || 0 }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <!-- 跟进方式数据 type == 16-->
      <el-card v-if="type == 16" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>跟进方式数据</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              {{ row.userName }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="微信"
            prop="wechat"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 3,
                  })
                "
                class="ableClick"
                >{{ row.wechat }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="电话"
            prop="cellphone"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 2,
                  })
                "
                class="ableClick"
                >{{ row.cellphone }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="面谈"
            prop="face"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 1,
                  })
                "
                class="ableClick"
                >{{ row.face }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="短信"
            prop="sms"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 4,
                  })
                "
                class="ableClick"
                >{{ row.sms }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="邮件"
            prop="email"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 5,
                  })
                "
                class="ableClick"
                >{{ row.email }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="QQ"
            prop="qq"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 6,
                  })
                "
                class="ableClick"
                >{{ row.qq }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="其他"
            prop="other"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 11,
                    userId: row.userId,
                    deptId: row.deptId,
                    followUpMethod: 7,
                  })
                "
                class="ableClick"
                >{{ row.other }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="占比"
            prop="rate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.rate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <!-- 商机状态转化率与占比 无钻取 -->
      <el-card v-if="type == 17" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>商机状态转化率与占比</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="发现需求">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o1,
                  })
                "
                class="ableClick"
                >{{ row.p1 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="发现需求转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t1 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="确认需求">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o2,
                  })
                "
                class="ableClick"
                >{{ row.p2 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="确认需求转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t2 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提供解决方案">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o3,
                  })
                "
                class="ableClick"
                >{{ row.p3 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="提供解决方案转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t3 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="促成及处理异议">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o4,
                  })
                "
                class="ableClick"
                >{{ row.p4 || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="促成及处理异议转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t4 || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合同阶段">
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 15,
                    deptId: row.deptId,
                    userId: row.userId,
                    opportunityStatus: row.o5,
                  })
                "
                class="ableClick"
                >{{ row.p5 || 0 }}</span
              >
            </template>
          </el-table-column>

          <el-table-column align="center" label="合同阶段转化率">
            <template slot-scope="{ row }">
              <span>{{ row.t5 || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="商机数量占比">
            <template slot-scope="{ row }">
              <span>{{ row.percentage || 0 }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <!-- 订单状态转化率与占比  type == 18  无钻取  -->
      <el-card v-if="type == 18" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span>订单状态转化率与占比列表</span>
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading1"
          @sort-change="sortChange"
        >
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column align="center" label="姓名">
            <template slot-scope="{ row }">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="支付首款"
            prop="firstPayNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 1,
                  })
                "
                class="ableClick"
                >{{ row.firstPayNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="进度款"
            prop="handleNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 2,
                  })
                "
                class="ableClick"
                >{{ row.handleNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="进度款转换率"
            prop="handleConvertRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.handleConvertRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="收取尾款"
            prop="lastPayNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 3,
                  })
                "
                class="ableClick"
                >{{ row.lastPayNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="收取尾款转换率"
            prop="lastPayConvertRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.lastPayConvertRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已办结"
            prop="finishNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 4,
                  })
                "
                class="ableClick"
                >{{ row.finishNum }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="支付全款"
            prop="payAllNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 6,
                  })
                "
                class="ableClick"
                >{{ row.payAllNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已退单"
            prop="refundNum"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 13,
                    userId: row.userId,
                    deptId: row.deptId,
                    orderStatus: 5,
                  })
                "
                class="ableClick"
                >{{ row.refundNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="退单率"
            prop="refundRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.refundRate }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单状态占比"
            prop="refundRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span>{{ row.orderCountRate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
    </div>
    <productList
      ref="productList"
      :ifDIO="false"
      :queryParams="queryParams"
    ></productList>
  </div>
</template>

<script>
import {
  getDataSourcePercentageDeptList,
  getDataSourcePercentageUserList,
  dataSourceList,
  followUpList,
  getDetailClueDataList,
  getDetailOpportunityDataList,
  getDetailOrderDataList,
  getReferralOrderList,
  getFollowUpMethodList,
  getFollowUpMethodDetailList,
  getOrderStatusNumAndConvertRate,
  getOrderStatusAnalysis,
  getOpportunityPercentageDeptList,
  getDiscoverRequire,
} from "@/api/newreport/analyse";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import mixin from "./minxin";
import { mapState } from "vuex";
import productList from "./productList.vue";

import Chooseweek from "@/components/Chooseweek/weeks1.vue";
export default {
  name: "detailed",
  mixins: [mixin],
  components: { Treeselect, productList, Chooseweek },
  data() {
    return {
      namesang: undefined,
      followUpMethod: undefined,
      clueName: undefined,
      dataSourceType: undefined,
      type: false,
      url: undefined,
      loading1: false,
      list: [],
      timeType: 1,
      storageData: [], // pefore过来接受session的值
      detailData: [], // detai接受session的值
      label: "",
      showBtn: true,
      setStartYear: undefined,
      setEndYear: undefined,
      setStartMonth: undefined,
      setEndMonth: undefined,
      setStartDay: undefined,
      setEndDay: undefined,
      ableClear: true, // 控制是否可以删除用户，当用户进来时没有部门 是最低层时，对部门进行隐藏 固定当前用户且无法删除
      showDepartSelect: true,
      showUsername: false,
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  created() {
    this.getTreeselect();
  },
  watch: {
    $route: {
      handler() {
        this.getTreeselectArr1 = String(this.$route.query.deptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });
        // this.queryParams.dataSourceType = undefined;
        // this.queryParams.userId = "";
        if (
          this.$route.query.deptIds == undefined &&
          this.$route.query.type == 1
        ) {
          this.$route.query.type = 3;
        }

        this.queryParams.pageNum = 1;
        this.queryParams.pageSize = 10;
        this.total = 0;
        this.type = this.$route.query.type;
        this.queryParams.timeType =
          this.$route.query.timeType == 4
            ? Number(this.$route.query.timeType - 1)
            : Number(this.$route.query.timeType);
        for (const key in this.$route.query) {
          if (
            this.$route.query[key] != "undefined" &&
            this.$route.query[key] != "null" &&
            key != "type"
          ) {
            if (key == "timeType") {
              this.timeType = Number(this.$route.query[key]);
            } else if (key == "namesang") {
              this.namesang = this.$route.query[key];
            } else if (key == "clueName") {
              this.clueName = this.$route.query[key];
            } else {
              this.queryParams[key] = this.$route.query[key];
            }
          }
        }
        this.$nextTick(() => {
          if (this.$route.query.timeType == 3) {
            this.$refs.Chooseweek.getMont(this.$route.query.timeValueBegin);
          }
        });

        this.datesDataType = this.$route.query.timeType;
        if (this.datesDataType == 1) {
          this.setStartYear = this.queryParams.timeValueBegin;
          this.setEndYear = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 2) {
          this.setStartMonth = this.queryParams.timeValueBegin;
          this.setEndMonth = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 4) {
          this.setStartDay = this.queryParams.timeValueBegin;
          this.setEndDay = this.queryParams.timeValueEnd;
        }

        // 判断进入这个页面时是否是指定的页面，是则获取之前存入数据 否则不获取
        if (
          JSON.parse(sessionStorage.getItem("detailDatas")) !== null &&
          JSON.parse(sessionStorage.getItem("detailDatas")).length !== 0
        ) {
          let data = JSON.parse(sessionStorage.getItem("detailDatas"));
          let keyData = data.pop();

          if (keyData.keys == 123) {
            this.detailData = JSON.parse(sessionStorage.getItem("detailDatas"));
            this.queryParams = this.detailData.pop();

            sessionStorage.setItem(
              "detailDatas",
              JSON.stringify(this.detailData)
            );
            this.queryParams.timeType = this.queryParams.timeType;
            this.queryParams.keys = null;
            this.timeType = this.queryParams.setDatesType;

            this.getTreeselectArr1 = String(this.queryParams.deptIds)
              .split(",")
              .map((i) => {
                if (i == 200) {
                  return Number(i);
                } else {
                  return i;
                }

                this.dateDatas1 = this.queryParams.timeValueBegin;
                this.dateDatas2 = this.queryParams.timeValueEnd;

                this.datesDataType = this.queryParams.setDatesType;
              });
            this.dateDatas1 = this.queryParams.timeValueBegin;
            this.dateDatas2 = this.queryParams.timeValueEnd;

            this.datesDataType = this.queryParams.setDatesType;

            if (this.datesDataType == 1) {
              this.setStartYear = this.queryParams.timeValueBegin;
              this.setEndYear = this.queryParams.timeValueEnd;
            }
            if (this.datesDataType == 2) {
              this.setStartMonth = this.queryParams.timeValueBegin;
              this.setEndMonth = this.queryParams.timeValueEnd;
            }
            if (this.datesDataType == 4) {
              this.setStartDay = this.queryParams.timeValueBegin;
              this.setEndDay = this.queryParams.timeValueEnd;
            }
          }
        }
        if (this.queryParams.userId) {
          this.queryParams.deptId = undefined;
          this.queryParams.deptIds = undefined;
          this.getTreeselectArr1 = [];
          this.queryParams.userId = this.queryParams.userId;
        }

        this.getList();
      },
      immediate: true,
      deep: true,
    },

    // "queryParams.timeType": {
    //   handler(n) {
    //       console.log(n);
    //     if (n == 1) {
    //       if (this.setStartYear !== undefined) {
    //       this.queryParams.timeValueBegin=this.setStartYear,
    //       this.queryParams.timeValueEnd=this.setEndYear;
    //       } else {
    //         this.dateMonth =

    //           ["2023", "2023"]
    //       }

    //     } else if (n == 3) {
    //     } else {
    //       this.pickerType = n == 2 ? "monthrange" : "daterange";
    //       this.valueFormat = n == 2 ? "yyyy-MM" : "yyyy-MM-dd";

    //       if (n == 2) {

    //         if (this.setStartMonth !== undefined) {
    //           this.dateMonth =

    //             [this.setStartMonth, this.setEndMonth]
    //         } else {
    //           this.dateMonth =

    //             ["2023-01", "2023-01"]
    //         }

    //       } else {

    //         if (this.setStartDay !== undefined) {
    //           this.dateMonth =

    //             [this.setStartDay, this.setEndDay]
    //         } else {
    //           this.dateMonth =

    //             ["2023-01-01", "2023-01-01"]
    //         }

    //       }

    //     }
    //   },
    // },
  },
  mounted() {},
  methods: {
    date(value) {
      this.queryParams.timeValueBegin = value[0];
      this.queryParams.timeValueEnd = value[1];
    },
    getList() {
      var queryParamsData = this.$route.query;
      // queryParamsData.pageSize= this.queryParams.pageSize
      // queryParamsData.pageNum= this.queryParams.pageNum
      // queryParamsData.userId= this.queryParams.userId
      // queryParamsData.userName= this.queryParams.userName

      if (this.$route.query.type == 1) {
        this.loading1 = true;
        getDataSourcePercentageDeptList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.list.forEach((element) => {
            element.dataSourceList.forEach((item) => {
              element["p" + item.dataSourceName] = item.dataSourceCount;
            });
          });
          this.loading1 = false;
        });
      }
      if (this.$route.query.type == 2) {
        getDataSourcePercentageUserList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.list.forEach((element) => {
            element.dataSourceList.forEach((item) => {
              element["p" + item.dataSourceName] = item.dataSourceCount;
            });
          });
        });
      }
      if (this.$route.query.type == 3) {
        this.loading1 = true;
        if (this.$route.query.dataSourceType == undefined) {
          this.label = "全部数据";
        } else {
          this.label =
            this.commonData.dataSourceList[
              this.$route.query.dataSourceType - 1
            ].label;
        }

        dataSourceList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading1 = false;
        });
      }
      if (this.$route.query.type == 4) {
        followUpList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 5) {
        getDetailClueDataList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 6) {
        getDetailOpportunityDataList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 7) {
        getDetailOrderDataList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 9) {
        getReferralOrderList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 10) {
        getFollowUpMethodList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          if (this.list[0].userName == null) {
            this.showFollow = true;
            this.showUsername = false;
          } else {
            this.showFollow = false;
            this.showUsername = true;
          }
        });
      }
      if (this.$route.query.type == 11) {
        getFollowUpMethodDetailList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 12) {
        this.loading1 = true;
        getOrderStatusNumAndConvertRate(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading1 = false;
        });
      }

      if (this.$route.query.type == 13) {
        getOrderStatusAnalysis(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 14) {
        getOpportunityPercentageDeptList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;

          this.list.map((item, index) => {
            item.opportunityPercentageVoList.forEach((item1) => {
              if (item1.opportunityStatusName == "发现需求") {
                item["p1"] = item1.opportunityTypeCount;
                item["o1"] = item1.opportunityStatus;
                item["t1"] = item1.discoverNeedsPercentage;
              }
              if (item1.opportunityStatusName == "确认需求") {
                item["p2"] = item1.opportunityTypeCount;
                item["o2"] = item1.opportunityStatus;
                item["t2"] = item1.confirmNeedsPercentage;
              }
              if (item1.opportunityStatusName == "提供解决方案") {
                item["p3"] = item1.opportunityTypeCount;
                item["o3"] = item1.opportunityStatus;
                item["t3"] = item1.provideSolutionsPercentage;
              }
              if (item1.opportunityStatusName == "促成及处理异议") {
                item["p4"] = item1.opportunityTypeCount;
                item["o4"] = item1.opportunityStatus;
                item["t4"] = item1.dealWithProblemPercentage;
              }
              if (item1.opportunityStatusName == "合同阶段") {
                item["p5"] = item1.opportunityTypeCount;
                item["o5"] = item1.opportunityStatus;
                item["t5"] = item1.contractPercentage;
              }
            });
          });
        });
      }
      if (this.$route.query.type == 15) {
        getDiscoverRequire(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }
      if (this.$route.query.type == 16) {
        getFollowUpMethodList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
        });
      }

      if (this.$route.query.type == 17) {
        getOpportunityPercentageDeptList(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;

          this.list.map((item, index) => {
            item.opportunityPercentageVoList.forEach((item1) => {
              if (item1.opportunityStatusName == "发现需求") {
                item["p1"] = item1.opportunityTypeCount;
                item["o1"] = item1.opportunityStatus;
                item["t1"] = item1.discoverNeedsPercentage;
              }
              if (item1.opportunityStatusName == "确认需求") {
                item["p2"] = item1.opportunityTypeCount;
                item["o2"] = item1.opportunityStatus;
                item["t2"] = item1.confirmNeedsPercentage;
              }
              if (item1.opportunityStatusName == "提供解决方案") {
                item["p3"] = item1.opportunityTypeCount;
                item["o3"] = item1.opportunityStatus;
                item["t3"] = item1.provideSolutionsPercentage;
              }
              if (item1.opportunityStatusName == "促成及处理异议") {
                item["p4"] = item1.opportunityTypeCount;
                item["o4"] = item1.opportunityStatus;
                item["t4"] = item1.dealWithProblemPercentage;
              }
              if (item1.opportunityStatusName == "合同阶段") {
                item["p5"] = item1.opportunityTypeCount;
                item["o5"] = item1.opportunityStatus;
                item["t5"] = item1.contractPercentage;
              }
            });
          });
        });
      }

      if (this.$route.query.type == 18) {
        this.loading1 = true;
        getOrderStatusNumAndConvertRate(this.queryParams).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading1 = false;
        });
      }
    },

    handleClick({
      type,
      deptId,
      dataSourceType,
      userId,
      archiveId,
      clueName,
      followUpMethod,
      orderStatus,
      orderId,
      opportunityStatus,
    }) {
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;
      this.queryParams.setDatesType = this.timeType;
      this.queryParams.keys = null;

      if (this.detailData == []) {
        this.detailData = JSON.parse(sessionStorage.getItem("detailDatas"));

        this.detailData.push(this.queryParams);

        sessionStorage.setItem("detailDatas", JSON.stringify(this.detailData));
      } else {
        this.detailData = JSON.parse(sessionStorage.getItem("detailDatas"));
        if (this.detailData == null) {
          this.detailData = [];
        }
        this.detailData.push(this.queryParams);
        sessionStorage.setItem("detailDatas", JSON.stringify(this.detailData));
      }
      this.queryParams.userId = userId;

      if (
        this.getTreeselectArr.some((i) => {
          return i == deptId;
        })
      ) {
        if (type == 1) {
          type = 3;
        }
        if (type == 10) {
          type = 16;
        }

        if (type == 14) {
          type = 17;
        }

        if (type == 12) {
          type = 18;
        }

        this.getTreeselectArr1 = [deptId];
        this.queryParams.deptId = this.getTreeselectArr1.join(",");
        this.queryParams.deptIds = deptId;
      } else {
        this.getTreeselectArr1 = [];
        this.getTreeselectList1(this.deptOptions, deptId);

        this.queryParams.deptIds = this.getTreeselectArr1.join(",");
      }

      // this.getTreeselectArr1 = [];
      //     this.getTreeselectList1(this.deptOptions, deptId);

      // this.queryParams.deptIds = this.getTreeselectArr1.join(",");

      var _this = this;
      // process/detailed
      this.$router.push({
        name: "Detailed",
        query: {
          type,
          deptId,
          dataSourceType,
          userId: _this.queryParams.userId,
          archiveId,
          clueName,
          followUpMethod,
          orderStatus,
          opportunityStatus,
          timeType: _this.timeType,
          timeValueBegin: _this.queryParams.timeValueBegin,
          timeValueEnd: _this.queryParams.timeValueEnd,
          deptIds: _this.queryParams.deptIds,
          followedId: orderId,
        },
      });
    },
    // 排序改变
    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";

      this.getList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.deptIds = this.getTreeselectArr1.join(",");
      let id2 = this.queryParams.deptId;
      this.queryParams.deptId = undefined;
      this.getList();

      this.queryParams.deptId = id2;
    },
    // 返回上一页面
    goBack() {
      if (
        JSON.parse(sessionStorage.getItem("detailDatas")) !== null &&
        JSON.parse(sessionStorage.getItem("detailDatas")).length !== 0
      ) {
        this.$router.go(-1);
        this.detailData = JSON.parse(sessionStorage.getItem("detailDatas"));
        let data = this.detailData.pop();
        data.keys = 123;
        this.detailData.push(data);
        sessionStorage.setItem("detailDatas", JSON.stringify(this.detailData));
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.vue-treeselect {
  margin-right: 10px;
}

::v-deep .vue-treeselect__control {
  width: 350px;
  min-height: 30px;
  line-height: 32px;
}

::v-deep .vue-treeselect__multi-value-item {
  height: 22px;
}

::v-deep .vue-treeselect__multi-value-item-container {
  height: 25px;
}

::v-deep .vue-treeselect__multi-value-item {
  display: block;
  line-height: 18px;
  height: 22px;
}

::v-deep .vue-treeselect__value-container {
  width: 400px;
  line-height: normal;
}

::v-deep .vue-treeselect__control-arrow-container {
  display: block;
  position: absolute;
  top: 2px;
  right: 8px;
  width: 12px;
  height: 30px;
  line-height: 32px;
}
</style>